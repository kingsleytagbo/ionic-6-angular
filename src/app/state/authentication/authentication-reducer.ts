import * as AuthenticationActions from './authentication-action';
import { RootStoreAction } from '../root/root-store-action';
import { initialAuthenticationState, AuthenticationState } from './authentication-state';

export function AuthenticationStoreReducer(state = initialAuthenticationState, action: RootStoreAction): AuthenticationState {
    // console.log({ AuthenticationReducer: { action: action, state: state } });
    switch (action.type) {

        case AuthenticationActions.ActionTypes.GET_REQUEST: {
            return {
                ...state,
                actionType: AuthenticationActions.ActionTypes.GET_REQUEST,
                isLoading: true,
                error: null
            };
        }

        case AuthenticationActions.ActionTypes.GET_SUCCESS: {
            return {
                ...state,
                actionType: AuthenticationActions.ActionTypes.GET_SUCCESS,
                isLoading: false,
                error: null,
                data:action.payload.data
            };
        }

        case AuthenticationActions.ActionTypes.GET_FAILURE: {
            return {
                ...state,
                actionType: AuthenticationActions.ActionTypes.GET_FAILURE,
                isLoading: false,
                error: action.payload,
                data:action.payload
            };
        }

        case AuthenticationActions.ActionTypes.LOGOUT: {
            return {
                ...state,
                actionType: AuthenticationActions.ActionTypes.LOGOUT,
                isLoading: false,
                error: null,
                data:null
            };
        }

        default: {
            return state;
        }

    }
}