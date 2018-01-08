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
  page = 1;
  canLoadMore = false;
  loaded = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: AppState,
    public storage: Storage,
    public callNumber: CallNumber,
    public defApi: DefApiProvider,
    public menu: MenuController) {
    menu.swipeEnable(true, 'menu');
    this.status_id = navParams.data;
    this.loadData(true);
  }

  getOrder(refresh) {
    if (refresh) {
      this.page = 1;
    }

    let params = {
      status: this.status_id,
      page: this.page
    };

    this.defApi.getOrders(params).subscribe(response => {
      if (this.page == 1) {
        this.orders = response.orders;
      } else {
        this.orders = this.orders.concat(response.orders);
      }

      this.page++;
      if (response != null && response.orders.length > 0) {
        this.canLoadMore = true;
      }

      this.loaded = true;
    });
  }

  viewOrderDetail(order) {
    this.navCtrl.push('OrderDetailPage', order);
  }

  loadData(refresh) {
    let authToken = this.global.get('authToken');
    if (authToken != null) {
      this.getOrder(refresh);
    } else {
      this.storage.get('accessToken').then(token => {
        if (token) {
          let accessToken = token;
          if (accessToken != null && accessToken.AuthorizationModel != null) {
            let authToken = accessToken.AuthorizationModel.AccessToken;
            this.global.set('accessToken', token);
            this.global.set('authToken', authToken);
            this.getOrder(refresh);
          } else {
            this.navCtrl.setRoot('LoginPage');
          }
        } else {
          this.navCtrl.setRoot('LoginPage');
        }
      });
    }

  }

  loadMore(infiniteScroll) {
    setTimeout(() => {
      this.getOrder(false);
      infiniteScroll.complete();
    }, 1000);
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

  formatDateTime(dateTime: string) {
    return dateTime;
  }

}
