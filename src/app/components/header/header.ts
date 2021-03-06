import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { Observable, Subscription } from 'rxjs';
import { ofType } from "@ngrx/effects";
import { ActionsSubject, Store } from '@ngrx/store';

import * as AuthenticationActions from '../../state/authentication/authentication-action';
import { UserService } from '../../services/user-service';
import { RootStoreState } from 'src/app/state/root/root-store-state';


@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
  styleUrls: ['header.scss'],
})
export class Header implements OnInit{
  Authentication$: Observable<any>;
  public loggedIn = false;
  loginSubscription = new Subscription();
  eventSubscription = new Subscription();

  constructor(public router: Router,
  public UserService: UserService,
  private store: Store<RootStoreState>,
  private loginActionsSubject: ActionsSubject,
  public alert: AlertController ) { 
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.loginSubscription = this.loginActionsSubject.pipe(
      ofType<AuthenticationActions.GetSuccessAction>(AuthenticationActions.ActionTypes.GET_SUCCESS)
    ).subscribe(data => {
      //console.log({ 'login success changes': data });
      this.presentOKAlert('You are logged-in ...');
    });
    this.Authentication$ = this.store.select(state => state.Authentication);
    this.Authentication$.subscribe((data) => {
      //console.log({ data: data })
    });
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
  }


  async presentOKAlert(message: string) {
    const alert = await this.alert.create({
      header: 'Login',
      subHeader: 'Success',
      message: message,
      buttons: ['OK']
    });
  }

  checkLoginStatus() {
    return this.UserService.isLoggedIn().then(loggedIn => {
     // console.log({loggedIn: loggedIn});
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  login(){
    return this.router.navigateByUrl('/login');
  }

  logout (){
    this.UserService.logout().then(loggedIn => {
      this.store.dispatch(new AuthenticationActions.LogOutAction());
     return this.router.navigateByUrl('/login');
    });
  }

}
