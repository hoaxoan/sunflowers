import { DefApiProvider } from '../../providers/api/def-api';
import { Component, ViewChild, Renderer } from '@angular/core';

import {
  Content,
  IonicPage,
  Loading,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Platform,
  App
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ToastService } from '../../providers/util/toast';
import { TranslateService } from '@ngx-translate/core';
import * as _ from "lodash";

@IonicPage()
@Component({
  selector: 'page-order-edit',
  templateUrl: 'order-edit.html',
})
export class OrderEditPage {

  orderStatus = [];
  order: any;
  paymentSelected: boolean = false;

  loading: Loading;
  @ViewChild('view') view;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public iab: InAppBrowser,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastService,
    public translate : TranslateService,
    public renderer: Renderer,
    public modalCtrl: ModalController,
    public defApi: DefApiProvider,
    private platform: Platform,
    private app: App) {
    this.getOrderStatus();
    this.order = navParams.data;
    if (this.order.payment_status_id == 30) {
      this.paymentSelected = true;
    }
  }

  getOrderStatus() {
    this.defApi.getOrderStatus().subscribe(response => {
      if(response.orders_status != null && response.orders_status.length > 0){
        this.orderStatus = response.orders_status;
      }
    });
  }

  saveOrder() {
    let orderDelta = {
      id: this.order.id,
      order_status_id: this.order.order_status_id,
      payment_status_id: this.order.payment_status_id
    };

    if (this.paymentSelected) {
      orderDelta.payment_status_id = 30;
    }

    let dataJson = {
      order: orderDelta
    };
    // Update Order
    this.loading = this.loadingCtrl.create({
      content: this.translate.instant("Common.Saving")
    });
    this.loading.present();

    this.defApi.updateOrder(this.order.id, dataJson).subscribe(response => {
      if(response.orders != null && response.orders.length > 0){
        this.order = response.orders[0];
      }
      let order_status_id = this.order.order_status_id;
      let status = _.find(this.orderStatus, function(o) { return o.id ==  order_status_id});
      this.order.order_status_name = status.name;

      this.toastCtrl.create(this.translate.instant("Common.Success"));
      this.loading.dismiss();
    });
  }


}
