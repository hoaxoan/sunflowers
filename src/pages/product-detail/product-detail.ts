import { DefApiProvider } from '../../providers/api/def-api';
import { Component, ViewChild, Renderer } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

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
    public defApi: DefApiProvider,
    private platform: Platform,
    private app: App) {
    this.params = navParams.data;
    this.getProductById(this.params.id);
  }


  getProductById(id) {
    this.defApi.getProductById(id).subscribe(response => {
      let products = response.products;
      if (products != null && products.length > 0) {
        this.product = products[0];
      }
      this.loaded = true;
    },
      error => {
        this.loaded = true;
      });
  }

}
