import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthData } from '../../../providers/auth/auth-data';
import { DefApiProvider } from '../../../providers/api/def-api';
import { LoadingService } from '../../../providers/util/loading';
import { AlertService } from '../../../providers/alert/alert';
import { ToastService } from '../../../providers/util/toast';
import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppState } from '../../../app/app.global';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  HAS_LOGGED_IN = 'hasLoggedIn';
  ACCESS_TOKEN = 'accessToken';

  loginForm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder,
    public toastCtrl: ToastService, public alertCtrl: AlertService, public loadingCtrl: LoadingService,
    public authData: AuthData, public defApi: DefApiProvider, public splashscreen: SplashScreen,
    public events: Events, public global: AppState, public storage: Storage) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
      Validators.required])],
    });
    splashscreen.hide();
  }

  login() {
    let { email, password } = this.loginForm.controls;
    if (!this.loginForm.valid) {
      let errorMessage = "";

      if (!email.valid) {
        errorMessage = "Oops! Invalid e-mail.";
      } else if (!password.valid) {
        errorMessage = "Passwords must contain 6 to 20 characters.";
      }

      this.toastCtrl.create(errorMessage);
    } else {
      this.loadingCtrl.present();
      let { email, password } = this.loginForm.value;

      this.defApi.loginUser(email, password).subscribe(response => {
        // Store token
        this.storage.set(this.ACCESS_TOKEN, response);
        if (response != null && response.AuthorizationModel != null) {
          let authToken = response.AuthorizationModel.AccessToken;
          this.global.set('accessToken', response);
          this.global.set('authToken', authToken);
          this.firebaseLogin(email, password);
        }
      }, (error) => {
        this.storage.set(this.HAS_LOGGED_IN, false);
        this.loadingCtrl.dismiss().then(() => {
          this.alertCtrl.createWithError(error.message);
        });
      });


    }
  }

  firebaseLogin(email: string, password: string) {
    this.authData.loginUser(email, password).then(() => {
      this.storage.set(this.HAS_LOGGED_IN, true);
      this.events.publish('user:login');
      this.loadingCtrl.dismiss().then(() => {
        this.goToHome();
      });
    }, (error) => {
      this.storage.set(this.HAS_LOGGED_IN, false);
      this.loadingCtrl.dismiss().then(() => {
        this.alertCtrl.createWithError(error.message);
      });
    });
  }

  facebookLogin() {
    this.loadingCtrl.present();
    this.authData.facebookLogin().then(response => {
      if (response == true) {
        this.loadingCtrl.dismiss().then(() => {
          this.goToHome();
        });
      } else {
        this.loadingCtrl.dismiss().then(() => {
          if (response.message) {
            this.alertCtrl.createWithError(response.message);
          }
        });
      }
    }, error => {
      this.loadingCtrl.dismiss().then(() => {
        this.alertCtrl.createWithError(JSON.stringify(error));
      });
    });
  }

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  getToken(): Promise<object> {
    return this.storage.get(this.ACCESS_TOKEN).then((response) => {
      return response;
    });
  };

  goToHome() {
    this.navCtrl.setRoot('MenuPage');
  }

  goToSignup() {
    this.navCtrl.push('SignupPage');
  }

}
