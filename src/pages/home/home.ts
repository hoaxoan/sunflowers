import { DefApiProvider } from '../../providers/api/def-api';
import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { AppState } from '../../app/app.global';
import { Storage } from '@ionic/storage';

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
    if(authToken != null){
      this.getOrder();
    } else {
      this.storage.get('accessToken').then(token => {
        if (token) {
          let accessToken = token;
          if(accessToken != null && accessToken.AuthorizationModel != null){
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
}
