import { DefApiProvider } from '../../providers/api/def-api';
import { Component, ViewChild, Renderer } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { TranslateService } from '@ngx-translate/core';

import {
  Content,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Platform,
  App
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  product: any;
  segment: string = "product";
  loaded = false;
  params: any;

  @ViewChild('view') view;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public iab: InAppBrowser,
    public loadingCtrl: LoadingController,
    public renderer: Renderer,
    public modalCtrl: ModalController,
    public callNumber: CallNumber,
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public translate : TranslateService,
    public defApi: DefApiProvider,
    private platform: Platform,
    private app: App) {
    this.product = navParams.data;
    
    // if(this.product.images == null){
    //   this.product.images = [];
    // }
    // if(this.product.full_description != null){
    //   this.product.full_description = this.decodeHtmlEntity(this.product.full_description);
    // }
  }

  viewProductEdit(product){

  }

  ionViewDidLoad() {
    // if (this.product) {
    //   let id = this.product.id;
    //   setTimeout(function () {
    //     this.getProductById(id);
    //   }, 100);
    // }
  }

  getProductById(id) {
    let loading = this.loadingCtrl.create({
      content: this.translate.instant("Common.Loading"),
    });
    loading.present();
    this.defApi.getProductById(id).subscribe(response => {
      let products = response.products;
      if (products != null && products.length > 0) {
        this.product = products[0];
      }
      this.loaded = true;
      loading.dismiss();
    },
    error => {
      this.loaded = true;
      loading.dismiss();
    });
  }

  decodeHtmlEntity(text) {
    var el = document.createElement('div');
    el.innerHTML = text;
    return el.childNodes.length === 0 ? "" : el.childNodes[0].nodeValue;
  }
  


}
