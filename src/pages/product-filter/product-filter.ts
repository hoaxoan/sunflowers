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

  categories = [];
  manufacturers = [];
  params: any;
  public category_id = null;
  public manufacturer_id = null;
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
    this.category_id = this.params.category_id;
    this.manufacturer_id = this.params.manufacturer_id;
    this.from_date = this.params.from_date;
    this.to_date = this.params.to_date;
    this.getCategories();
    this.getManufacturers();
  }

  getCategories() {
    this.defApi.getCategories(null).subscribe(response => {
      if (response.categories != null && response.categories.length > 0) {
        this.categories = response.categories;
      }
    });
  }

  getManufacturers() {
    this.defApi.getManufacturers(null).subscribe(response => {
      if (response.manufacturers != null && response.manufacturers.length > 0) {
        this.manufacturers = response.manufacturers;
      }
    });
  }

  resetFilters() {
    // reset all
    this.category_id = null;
    this.manufacturer_id = null;
    this.from_date = moment();
    this.to_date = moment();
  }

  applyFilters() {
    // apply filters
    let params = {
      category_id: this.category_id,
      manufacturer_id: this.manufacturer_id,
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