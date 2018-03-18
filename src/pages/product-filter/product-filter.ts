import { DefApiProvider } from '../../providers/api/def-api';
import { Component } from '@angular/core';
import { ModalController, IonicPage, Platform, ViewController, MenuController, NavController, NavParams, App } from 'ionic-angular';
import { AppState } from '../../app/app.global';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import * as moment from 'moment'

@IonicPage()
@Component({
  selector: 'page-product-filter',
  templateUrl: 'product-filter.html'
})
export class ProductFilterPage {
  orderStatus = [];
  paymentStatus = [];
  params: any;
  public status_id = null;
  public payment_id = null;
  public from_date = moment();
  public to_date = moment();

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public defApi: DefApiProvider,
    private platform: Platform,
    private app: App
  ) {

    this.params = this.navParams.data;
    this.status_id = this.params.status_id;
    this.payment_id = this.params.payment_id;
    this.from_date = this.params.from_date;
    this.to_date = this.params.to_date;
    this.getOrderStatus();
    this.getPaymentStatus();
  }

  getOrderStatus() {
    this.defApi.getOrderStatus().subscribe(response => {
      if (response.orders_status != null && response.orders_status.length > 0) {
        this.orderStatus = response.orders_status;
      }
    });
  }

  getPaymentStatus() {
    this.defApi.getPaymentStatus().subscribe(response => {
      if (response.payments_status != null && response.payments_status.length > 0) {
        this.paymentStatus = response.payments_status;
      }
    });
  }

  resetFilters() {
    // reset all
    this.status_id = null;
    this.payment_id = null;
    this.from_date = moment();
    this.to_date = moment();
  }

  applyFilters() {
    // apply filters
    let params = {
      status_id: this.status_id,
      payment_id: this.payment_id,
      from_date: this.from_date,
      to_date: this.to_date
    };

    this.dismiss(params);
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }
}