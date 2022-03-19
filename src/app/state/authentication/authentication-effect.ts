import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import * as AuthenticationActions from './authentication-action';
import { UserService } from '../../services/user-service';
import { Observable, of as observableof, from } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ActionTypes } from './authentication-action';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { Authentication } from '../../models/authentication';
import { switchAll } from 'rxjs/internal/operators/switchAll';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, Route } from '@angular/router';


@Injectable()
export class AuthenticationStoreEffects {
    constructor(
        private actions$: Actions,
        private userService: UserService,
        private http: HttpClient,
        private router: Router
    ) { }


/*
    postLogin2$ = this.actions$.pipe(
        ofType<AuthenticationActions.GetRequestAction>(AuthenticationActions.ActionTypes.GET_REQUEST),
        switchMap(action => {
            console.log({ AuthenticationEffects_postLogin_1: { action: action, payload: action.payload } });
            return this.userService.loginObservable(action.payload).pipe(
                map((data: any) => {
                    console.log({ map: { data:data, action:action, payload: action.payload } });
                    return new AuthenticationActions.GetSuccessAction({ data: !data ? action.payload : data });
                },                                          
                catchError((err: any, caught: any) => {
                        console.log({ map: { err: err } });
                        return observableof(new AuthenticationActions.GetFailureAction(err));
                    })
                )

            )
        })
    );
    */

    @Effect()
    Authenticate$ = this.actions$
    .pipe(
      // filter out the actions
      ofType<AuthenticationActions.GetRequestAction>(AuthenticationActions.ActionTypes.GET_REQUEST),
      switchMap((action) =>
        // call the service
        this.userService.loginObservable(action.payload).pipe(
          // return a Success action when everything went OK
          map(data => {
            // console.log({ map: { data:data, action:action, payload: action.payload } });
                  if ((data.authenticated === true) && (data.username && data.username.length > 0)) {

                      return new AuthenticationActions.GetSuccessAction({ data: data });
                  }
                  else{
                    return new AuthenticationActions.GetFailureAction(false);
                  }
            },
          // return a Failed action when something went wrong
          catchError(error => {
              return observableof(new AuthenticationActions.GetFailureAction(error))
            }),
        ),
        tap((action) => 
            { 

            if (action.payload.data && action.payload.data.authenticated === true) {
                this.router.navigateByUrl('/lms');
            }
        }),
      ),
    ));

}