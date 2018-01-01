import { DefApiProvider } from '../../providers/api/def-api';
import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { AppState } from '../../app/app.global';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  status_id: any;
  orders = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: AppState,
    public storage: Storage,
    public callNumber: CallNumber,
    public defApi: DefApiProvider,
    public menu: MenuController) {
    menu.swipeEnable(true, 'menu');
    this.status_id = navParams.data;
    this.loadData();
  }

  getOrder() {
    let params = { status: this.status_id }
    this.defApi.getOrders(params).subscribe(response => {
      this.orders = response.orders;
    });
  }

  viewOrderDetail(order) {
    this.navCtrl.push('OrderDetailPage', order);
  }

  loadData() {
    let authToken = this.global.get('authToken');
    if (authToken != null) {
      this.getOrder();
    } else {
      this.storage.get('accessToken').then(token => {
        if (token) {
          let accessToken = token;
          if (accessToken != null && accessToken.AuthorizationModel != null) {
            let authToken = accessToken.AuthorizationModel.AccessToken;
            this.global.set('accessToken', token);
            this.global.set('authToken', authToken);
            this.getOrder();
          } else {
            this.navCtrl.setRoot('LoginPage');
          }
        } else {
          this.navCtrl.setRoot('LoginPage');
        }
      });
    }

  }

  openDialer(order) {
    let phoneNumber: string = null;

    if (order.shipping_address != null) {
      let phoneNumber = order.shipping_address.phone_number;
    } else if (order.billing_address != null) {
      let phoneNumber = order.billing_address.phone_number;
    }
    if (phoneNumber == null || phoneNumber == "") {
      return;
    }
    this.callNumber.callNumber(phoneNumber, true).then(response => {
    });
  }

  formatDateTime(dateTime: string){
    return dateTime;
  }

}
