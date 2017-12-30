import { AuthData } from '../../../providers/auth/auth-data';
import { AlertService } from '../../../providers/alert/alert';
import { LoadingService } from '../../../providers/util/loading';
import { ToastService } from '../../../providers/util/toast';
import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      formBuilder: FormBuilder, public toastCtrl: ToastService,
      public loadingCtrl: LoadingService, public alertCtrl: AlertService,
      public authData: AuthData) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
      Validators.required])],
      passwordConfirm: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
      Validators.required])],
      name: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  signup() {
    let { email, password, passwordConfirm, name, phone } = this.signupForm.controls;
    let passwordMismatch = passwordConfirm.value !== password.value;
    if (!this.signupForm.valid || passwordMismatch) {
      let errorMessage = "";

      if(passwordMismatch) {
        errorMessage = "Password and confirmation must be equal.";
      }

      if (!name.valid) {
        errorMessage = "Name is required.";
      } else if (!phone.valid) {
        errorMessage = "Phone is required.";
      } else if (!email.valid) {
        errorMessage = "Oops! Invalid e-mail.";
      } else if (!password.valid) {
        errorMessage = "Passwords must contain 6 to 20 characters.";
      }

      this.toastCtrl.create(errorMessage);
    } else {
      this.loadingCtrl.present();
      let { email, password, name, phone } = this.signupForm.value;
      this.authData.signupUser(email, password, name, phone).then(() => {
        this.loadingCtrl.dismiss().then(() => {
          this.navCtrl.setRoot('MenuPage');
        });
      }, (error) => {
        this.loadingCtrl.dismiss().then(() => {
          this.alertCtrl.createWithError(error.message);
        });
      });
    }
  }

}
