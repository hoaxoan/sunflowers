import { AppState } from './app.global';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MyApp } from './app.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Ionic native providers
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { Shake } from '@ionic-native/shake';
import { NativeAudio } from '@ionic-native/native-audio';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { Geolocation } from '@ionic-native/geolocation';
import { Flashlight } from '@ionic-native/flashlight';
import { IonicStorageModule } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';

// Custom providers
import { AudioService } from '../providers/audio-service/audio-service';
import { GoogleImagesProvider } from '../providers/google-images/google-images';
import { FirebaseDataProvider } from '../providers/firebase-data/firebase-data';
import { MotionProvider } from '../providers/motion/motion';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { AlertService } from '../providers/alert/alert';
import { ToastService } from '../providers/util/toast';
import { LoadingService } from '../providers/util/loading';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network';
import { DefApiProvider } from '../providers/api/def-api';
import { NotificationProvider } from '../providers/notification/notification';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';

import { AuthData } from '../providers/auth/auth-data';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyAHCeF3jhFPxVv5gU00rlUjGx7RoVwym98",
  authDomain: "omnifocus3.firebaseapp.com",
  databaseURL: "https://omnifocus3.firebaseio.com",
  projectId: "omnifocus3",
  storageBucket: "",
  messagingSenderId: "1003499785313"
};

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      preloadModules: true
    }),
    CacheModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__winterdb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    AppState,
    StatusBar,
    SplashScreen,
    Device,
    Shake,
    NativeAudio,
    GoogleImagesProvider,
    InAppBrowser,
    YoutubeVideoPlayer,
    FirebaseDataProvider,
    Flashlight,
    Geolocation,
    Network,
    FCM,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    AudioService,
    AlertService,
    ToastService,
    LoadingService,
    MotionProvider,
    ConnectivityProvider,
    DefApiProvider,
    NotificationProvider,

    AuthData,
    Facebook
  ]
})
export class AppModule {}
