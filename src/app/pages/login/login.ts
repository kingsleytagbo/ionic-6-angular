import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { UserOptions } from '../../models/user-options';
import { Store, ActionsSubject } from '@ngrx/store';
import { RootStoreState } from '../../state/root/root-store-state';
import * as AuthenticationActions from '../../state/authentication/authentication-action';
import { MenuController } from '@ionic/angular';

import { Authentication } from '../../models/authentication';
import { Subscription } from 'rxjs';
import { ofType } from "@ngrx/effects";
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss'],
})
export class LoginPage {
  login: UserOptions = { id:'', username: '', emailaddress: '' };
  submitted = false;
  isValid = true;
  public loggedIn = false;
  loginSubscription = new Subscription();

  constructor(
    public UserService: UserService,
    public router: Router,
    private store: Store<RootStoreState>,
    private loginActionsSubject: ActionsSubject,
    public alert: AlertController,
    public menu: MenuController
  ) {
    this.loginSubscription = this.loginActionsSubject.pipe(
      ofType<AuthenticationActions.GetFailureAction>(AuthenticationActions.ActionTypes.GET_FAILURE)
    ).subscribe(data => {
      console.log(data)
      this.loggedIn = false;
      this.presentAlert();
    });
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    // disable the root left menu when entering this page
    this.menu.enable(false);
  }

  async presentAlert() {
    const alert = await this.alert.create({
      header: 'Login',
      subHeader: 'Error',
      message: 'Your username or emailaddress is incorrect!',
      buttons: ['OK']
    });

    await alert.present();
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      const user = new Authentication(this.login.username, this.login.emailaddress);
      this.store.dispatch(new AuthenticationActions.GetRequestAction(user));
    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
