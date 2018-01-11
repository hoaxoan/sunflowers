import { DefApiProvider } from '../../providers/api/def-api';
import { Component } from '@angular/core';
import { ModalController, IonicPage, Platform, ViewController, MenuController, NavController, NavParams, 
  ToastController, Refresher } from 'ionic-angular';
import { AppState } from '../../app/app.global';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { TranslateService } from '@ngx-translate/core';
import { HomeFilterPage } from '../home-filter/home-filter';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  status: any;
  orders = [];
  page = 1;
  canLoadMore = false;
  loaded = false;
  params: any;


  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public global: AppState,
    public storage: Storage,
    public callNumber: CallNumber,
    public defApi: DefApiProvider,
    public toastCtrl: ToastController,
    public translate : TranslateService,
    public menu: MenuController) {
    menu.swipeEnable(true, 'menu');
    this.status = navParams.get('status');
    console.log(this.status);
    this.params = {
      status: this.status,
      page: this.page
    };
    this.loadData(true);
  }

  getOrder(refresh) {
    if (refresh) {
      this.page = 1;
    }

    this.params.page = this.page;

    this.defApi.getOrders(this.params).subscribe(response => {
      if (this.page == 1) {
        this.orders = response.orders;
      } else {
        this.orders = this.orders.concat(response.orders);
      }

      this.page++;
      if (this.orders != null && this.orders.length > 0) {
        this.canLoadMore = true;
      }

      this.loaded = true;
    },
    error => {
      this.loaded = true;
      this.canLoadMore = false;
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

  async openDialer(order): Promise<any> {
    try {
      let phoneNumber: string = null;

      if (order.shipping_address != null) {
        let phoneNumber = order.shipping_address.phone_number;
      } else if (order.billing_address != null) {
        let phoneNumber = order.billing_address.phone_number;
      }
      if (phoneNumber == null || phoneNumber == "") {
        return;
      }
      await this.callNumber.callNumber(phoneNumber, false)
        .then(() => console.log('Launched dialer!'))
        .catch(() => console.log('Error launching dialer'));
    } catch (e) {
      console.log(e);
    }
  }

  doRefresh(refresher: Refresher) {
    this.params.page = 1;

    this.defApi.getOrders(this.params).subscribe(response => {
      this.orders = response.orders;

      this.page++;
      if (this.orders != null && this.orders.length > 0) {
        this.canLoadMore = true;
      }

      this.loaded = true;

      // simulate a network request that would take longer
      // than just pulling from out local json file
      setTimeout(() => {
        refresher.complete();

        const toast = this.toastCtrl.create({
          message: this.translate.instant("Order.OrderUpdated"),
          duration: 3000
        });
        toast.present();
      }, 1000);

    },
    error => {
      this.loaded = true;
      this.canLoadMore = false;
      refresher.complete();
    });
    
  }

  presentFilter() {
    let modal = this.modalCtrl.create(HomeFilterPage, this.params);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        // update data
        this.params = data;
        this.params.status = null;
        console.log(data);
        this.getOrder(true);
      }
    });
  }


  formatDateTime(dateTime: string) {
    return dateTime;
  }

}