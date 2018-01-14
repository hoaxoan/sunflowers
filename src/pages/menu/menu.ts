import { FirebaseDataProvider } from '../../providers/firebase-data/firebase-data';
import { IonicPage, Menu, Nav, NavController, Platform } from 'ionic-angular';
import { AudioService } from '../../providers/audio-service/audio-service';
import { MotionProvider } from '../../providers/motion/motion';
import { AlertService } from '../../providers/alert/alert';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Flashlight } from '@ionic-native/flashlight';
import { Component, ViewChild } from '@angular/core';
import { AppState } from '../../app/app.global';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
  segment: 'menu'
})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})

export class MenuPage {
  @ViewChild('content') content: Nav;
  @ViewChild(Menu) menu: Menu;

  rootPage: any = 'HomePage';
  activePage    = new Subject();

  splash        = false;
  side          = 'light';
  onMobile      = false;
  showContent   = true;

  pages: Array<{ title: string, component: any, active: boolean, icon: string }>;

  public menuRoot = 'HomePage';
  constructor(public nav: NavController,
    public global: AppState,
    public splashScreen: SplashScreen,
    public audioCtrl: AudioService,
    public flashlight: Flashlight,
    public firebaseData: FirebaseDataProvider,
    public alertCtrl: AlertService,
    public storage: Storage,
    public geolocation: Geolocation,
    public motionCtrl: MotionProvider,
    public platform: Platform,
    private translate : TranslateService) {
    this.initialize();
  }

  initialize() {
    //this.initAuth();
    this.initPages();
    this.onMobile = this.platform.is('cordova');
    // this.onMobile =  navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone');

    this.storage.get('splashInfo').then(data => {
      if(data) {
        var now = new Date();
        var difference = now.getTime() - data.getTime();
        var minutesDifference = Math.round(difference / 60000);

        if(minutesDifference >= 3) {
          this.showSplash();
        }
      } else {
        this.showSplash();
      }
    });
  }

  showSplash() {
    this.platform.ready().then(() => {
      //this.audioCtrl.playIntro();
    });

    this.splash = false;
    this.showContent = true;
    setTimeout(() => this.showContent = true, 3000);
    setTimeout(() => this.splash = false, 7800);
    this.storage.set('splashInfo', new Date());
  }

  initPages() {
    this.pages = [
      { title: this.translate.instant("Menu.Dashboard"), component: 'DashboardPage', active: true, icon: 'apps' },
      { title: this.translate.instant("Menu.Order"), component: 'HomePage', active: false, icon: 'cart' },
      { title: this.translate.instant("Menu.Product"), component: 'ProductPage', active: false, icon: 'flower' },
      { title: this.translate.instant("Menu.Map"), component: 'WorldMapPage', active: false, icon: 'map' },
      { title: this.translate.instant("Menu.Login"), component: 'LoginPage', active: false, icon: 'contact' },
    ];

    this.activePage.subscribe((selectedPage: any) => {
      this.pages.map(page => {
        page.active = page.title === selectedPage.title;
      });
    });
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.content.setRoot(page.component);
    this.activePage.next(page);
  }

  initAuth() {
    this.storage.get('accessToken').then(token => {
      if (token) {
        let accessToken = token;
        if(accessToken != null && accessToken.AuthorizationModel != null){
          let authToken = accessToken.AuthorizationModel.AccessToken;
          this.global.set('accessToken', token);
          this.global.set('authToken', authToken);
          this.menuRoot = "HomePage";
        } else {
          this.menuRoot = 'LoginPage';
        }
      } else {
        this.menuRoot = 'LoginPage';
      }
    });
  }

}