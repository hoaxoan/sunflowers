import { DefApiProvider } from '../../providers/api/def-api';
import { Component } from '@angular/core';
import { ModalController, IonicPage, Platform, ViewController, MenuController, NavController, NavParams, 
  ToastController, Refresher } from 'ionic-angular';
import { AppState } from '../../app/app.global';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { TranslateService } from '@ngx-translate/core';
import { HomeFilterPage } from '../home-filter/home-filter';
import * as _ from "lodash";

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html'
})
export class ProductPage {

  status: any;
  products = [];
  productLefts = [];
  productRights = [];
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
    this.params = {
      status: this.status,
      page: this.page
    };
    this.loadData(true);
  }

  getProducts(refresh) {
    if (refresh) {
      this.page = 1;
    }

    this.params.page = this.page;

    this.defApi.getProducts(this.params).subscribe(response => {
      if (this.page == 1) {
        this.products = response.products;
      } else {
        this.products = this.products.concat(response.products);
      }

      this.page++;
      if (this.products != null && this.products.length > 0) {
        this.canLoadMore = true;
      }

      let multiProducts = _.chunk(this.products, this.products.length/2);
      if(multiProducts != null && multiProducts.length > 0){
        this.productLefts = multiProducts[0];
        if(multiProducts.length > 1){
          this.productRights = multiProducts[1];
        }
      }
      
      this.loaded = true;
    },
    error => {
      this.loaded = true;
      this.canLoadMore = false;
    });
  }

  viewProductDetail(product) {
    this.navCtrl.push('ProductDetailPage', product);
  }

  loadData(refresh) {
    let authToken = this.global.get('authToken');
    if (authToken != null) {
      this.getProducts(refresh);
    } else {
      this.storage.get('accessToken').then(token => {
        if (token) {
          let accessToken = token;
          if (accessToken != null && accessToken.AuthorizationModel != null) {
            let authToken = accessToken.AuthorizationModel.AccessToken;
            this.global.set('accessToken', token);
            this.global.set('authToken', authToken);
            this.getProducts(refresh);
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
      this.getProducts(false);
      infiniteScroll.complete();
    }, 1000);
  }

  doRefresh(refresher: Refresher) {
    this.params.page = 1;

    this.defApi.getProducts(this.params).subscribe(response => {
      this.products = response.products;

      this.page++;
      if (this.products != null && this.products.length > 0) {
        this.canLoadMore = true;
      }

      let multiProducts = _.chunk(this.products, this.products.length/2);
      if(multiProducts != null && multiProducts.length > 0){
        this.productLefts = multiProducts[0];
        if(multiProducts.length > 1){
          this.productRights = multiProducts[1];
        }
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
        this.getProducts(true);
      }
    });
  }


  formatDateTime(dateTime: string) {
    return dateTime;
  }

}