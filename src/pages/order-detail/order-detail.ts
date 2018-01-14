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
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  order: any;
  shippingAddress: any;
  billingAddress: any;
  segment: string = "order";
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
    this.order = navParams.data;
    this.billingAddress = this.order.billing_address;
    this.shippingAddress = this.order.shipping_address;
    this.loadAddress();
  }

  viewOrderEdit(order) {
    this.navCtrl.push('OrderEditPage', order);
  }
  
  viewProductDetail(product) {
    this.navCtrl.push('ProductDetailPage', product);
  }

  loadAddress() {
    // Billing Address
    if (this.billingAddress != null) {
      let billAddress = this.billingAddress.address1;
      if (this.billingAddress.ward != null && this.billingAddress.ward != "") {
        billAddress += ", " + this.billingAddress.ward;
      }

      if (this.billingAddress.district != null && this.billingAddress.district != "") {
        billAddress += ", " + this.billingAddress.district;
      }

      if (this.billingAddress.province != null && this.billingAddress.province != "") {
        billAddress += ", " + this.billingAddress.province;
      }

      this.billingAddress.full_address = billAddress;
    }


    // Shipping Address
    if (this.shippingAddress != null) {
      let shipAddress = this.shippingAddress.address1;
      if (this.shippingAddress.ward != null && this.shippingAddress.ward != "") {
        shipAddress += ", " + this.shippingAddress.ward;
      }

      if (this.shippingAddress.district != null && this.shippingAddress.district != "") {
        shipAddress += ", " + this.shippingAddress.district;
      }

      if (this.shippingAddress.province != null && this.shippingAddress.province != "") {
        shipAddress += ", " + this.shippingAddress.province;
      }

      this.shippingAddress.full_address = shipAddress;
    }

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

  startExternalMap(address) {
    this.nativeGeocoder.forwardGeocode(address.full_address)
      .then((coordinates: NativeGeocoderForwardResult) => {
        console.log('The coordinates are latitude=' + coordinates.latitude + ' and longitude=' + coordinates.longitude)
        let data = { 
          address: address,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        };

        this.navCtrl.push('WorldMapPage', data);
      })
      .catch((error: any) => console.log(error));
  }

}
