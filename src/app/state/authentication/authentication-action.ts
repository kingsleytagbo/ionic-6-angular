import { Action } from '@ngrx/store';
import { Authentication } from '../../models/authentication';

export enum ActionTypes{
    GET_REQUEST = '[Authentication] Get Request',
    GET_FAILURE = '[Authentication] Get Failure',
    GET_SUCCESS = '[Authentication] Get Success',
    LOGOUT = 'LOGOUT'
};

export class GetRequestAction implements Action{
    readonly type = ActionTypes.GET_REQUEST;
    constructor(public payload: Authentication){}
}

export class GetFailureAction implements Action{
    readonly type = ActionTypes.GET_FAILURE;
    constructor(public payload: any){}
}

export class GetSuccessAction implements Action{
    readonly type = ActionTypes.GET_SUCCESS;
    constructor(public payload: any){}
}

export class LogOutAction implements Action{
    readonly type = ActionTypes.LOGOUT;
    constructor(public payload: any = null){}
}