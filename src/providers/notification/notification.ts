import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CacheService } from "ionic-cache";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { DefApiProvider } from '../../providers/api/def-api';
import { concat } from 'rxjs/operators/concat';

@Injectable()
export class NotificationProvider {

  constructor(public http: Http, 
    public cache: CacheService,
    public defApi: DefApiProvider) { 

  }

  registerToken(device){
    console.log("Call api");
    this.defApi.insertDevice(device).subscribe(response => {
        console.log(JSON.stringify(response));
    });
  }
  
  onHandleNotificationReceived(notification){

  }
}
