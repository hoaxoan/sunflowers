import { MenuShiftType } from '../pages/menu/shift-transition';
import { AppState } from './app.global';
import { Component, ViewChild } from '@angular/core';
import { MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import Fingerprint2 from 'fingerprintjs2';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';
import { FCM } from '@ionic-native/fcm';
import { NotificationProvider } from '../providers/notification/notification';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'MenuPage';

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public device: Device,
    public global: AppState,
    public storage: Storage,
    public afAuth: AngularFireAuth,
    public fcm: FCM,
    public translate: TranslateService,
    public notification: NotificationProvider) {

    // Translate
    this.initializeTranslate();
    // Auth
    this.initializeAuth();
    // App
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.storage.get('uuid').then(uuid => {
        if (uuid) {
          this.global.set('uuid', uuid);
        } else {
          new Fingerprint2().get((result, components) => {
            this.global.set('uuid', result);
            this.storage.set('uuid', result);
          });
        }
      });
      this.global.set('side', 'light');

      // MenuController.registerType('shift', MenuShiftType);

      this.statusBar.styleDefault();
      // set status bar to white
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#310084');

      this.splashScreen.hide();

      // Push Notification
      //this.initializeNotification();
      if (this.platform.is('ios') || this.platform.is('android')) {
        this.initializeNotification();
      }
    });
  }

  initializeTranslate() {
    this.translate.setDefaultLang('vi');
    this.translate.use('vi');
    // if (this.translate.getBrowserLang() !== undefined) {
    //   this.translate.use(this.translate.getBrowserLang());
    // } else {
    //   this.translate.use('vi'); // Set your language here
    // }
  }

  initializeNotification() {
    this.fcm.subscribeToTopic('sunflowers');

    this.fcm.getToken()
      .then(token => {
        console.log(`The token is ${token}`);
        let dataJson = {
          device: {
            cordova: this.device.cordova,
            model: this.device.model,
            platform: this.device.platform,
            uuid: this.device.uuid,
            version: this.device.version,
            manufacturer: this.device.manufacturer,
            serial: this.device.serial,
            token: token
          }
        };
        console.log(JSON.stringify(dataJson));
        this.notification.registerToken(dataJson);
      })
      .catch(error => {
        console.error('Error getting token', error);
      });

    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };

      this.notification.onHandleNotificationReceived(data);
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      let dataJson = {
        device: {
          cordova: this.device.cordova,
          model: this.device.model,
          platform: this.device.platform,
          uuid: this.device.uuid,
          version: this.device.version,
          manufacturer: this.device.manufacturer,
          serial: this.device.serial,
          token: token
        }
      };
      this.notification.registerToken(dataJson);
    });

  }

  initializeAuth() {
    this.storage.get('accessToken').then(token => {
      if (token) {
        let accessToken = token;
        if (accessToken != null && accessToken.AuthorizationModel != null) {
          let authToken = accessToken.AuthorizationModel.AccessToken;
          this.global.set('accessToken', token);
          this.global.set('authToken', authToken);
          this.rootPage = "MenuPage";
        } else {
          this.rootPage = 'LoginPage';
        }
      } else {
        this.rootPage = 'LoginPage';
      }
    });
  }

}
