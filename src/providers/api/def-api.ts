import { GoogleImagesProvider } from '../google-images/google-images';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { CacheService } from "ionic-cache";
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { AppState } from '../../app/app.global';
import { concat } from 'rxjs/observable/concat';

@Injectable()
export class DefApiProvider {
  private baseUrl = "http://localhost:8080/";
  //private baseUrl = "http://localhost:15536/";

  constructor(public http: Http, 
    public cache: CacheService,
    public global: AppState,
    private gImages: GoogleImagesProvider,
    public storage: Storage) { 

  }

  getKey(key: string): Promise<any>{
    return this.storage.get(key);
  }

  get(endpoint: string) {
    let cacheKey = endpoint;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let request  = this.http.get(endpoint, options).map(res => res.json());
    return this.cache.loadFromObservable(cacheKey, request);
  }

  post(endpoint: string, data: object){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let request  = this.http.post(endpoint, JSON.stringify(data), options).map(res => res.json());
    return this.http.post(endpoint, data, options).map(res => res.json());
  }

  getWithAuth(endpoint: string, params: object) {
    let authToken = this.global.get('authToken');
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append('Authorization', 'Bearer ' + authToken);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(endpoint, options).map(res => res.json());
  }

  postWithAuth(endpoint: string, data: object){
    let authToken = this.global.get('authToken');
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append('Authorization', 'Bearer ' + authToken);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(endpoint, data, options).map(res => res.json());
  }

  putWithAuth(endpoint: string, data: object){
    let authToken = this.global.get('authToken');
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append('Authorization', 'Bearer ' + authToken);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(endpoint, data, options).map(res => res.json());
  }

  getParams(param: any){
    let params: URLSearchParams = new URLSearchParams();
    for (var key in param) {
        if (param.hasOwnProperty(key)) {
            let val = param[key];
            params.set(key, val);
        }
    }
    return params;
  }
  
  loginUser(email: string, password: string): any {
    let endpoint = 'oauth/';
    let data = {
      email: email, 
      password: password
    };
    return this.post(this.baseUrl + endpoint, data);
  }

  getProducts(){
    let endpoint = 'api/products';
    return this.getWithAuth(this.baseUrl + endpoint, {});
  }

  getOrders(data: any){
    let endpoint = 'api/orders';
    let params = this.getParams(data);	
    return this.getWithAuth(this.baseUrl + endpoint, params);
  }

  getOrderStatus(){
    let endpoint = 'api/orderstatus';
    return this.getWithAuth(this.baseUrl + endpoint, {});
  }

  updateOrder(id, order){
    let endpoint = 'api/orders/' + id;
    return this.putWithAuth(this.baseUrl + endpoint, order);
  }

  getDashboardOrderCount(markAsDeliveryDate: any, deliveryDate: string){
    let endpoint = 'api/dashboardordercount?markAsDeliveryDate=' + markAsDeliveryDate + '&deliveryDate=' + deliveryDate;
    return this.getWithAuth(this.baseUrl + endpoint, {});
  }

  getDashboardOrderStatus(){
    let endpoint = 'api/dashboardorderstatus';
    return this.getWithAuth(this.baseUrl + endpoint, {});
  }

  insertDevice(device){
    let endpoint = 'api/devices';
    return this.post(this.baseUrl + endpoint, device);
  }
}
