import { Injectable } from '@angular/core';
import { StorageService } from './storage-service';
import { Authentication } from '../models/authentication';
import { Observable, from, of } from 'rxjs';
import { UserOptions } from '../models/user-options';


@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  _users: Array<UserOptions> = [{
    id: '1',
    UserName: 'admin',
    EmailAddress: "password",
    
  }, {
    id: '2',
    UserName: 'Jekyll Hyde',
    EmailAddress: "",
    
  }, {
    id: '3',
    UserName: 'Storm Trooper',
    EmailAddress: "",
    
  }, {
    id: '4',
    UserName: 'Lennox Lewis',
    EmailAddress: "",
    
  }];


  constructor(
    public storage: StorageService
  ) { }

  hasUser(user: any): boolean {
    return (this._users.indexOf(user) > -1);
  }

  addUser(user: any): void {
    this._users.push(user);
  }

  updateUser(user: any): void {
    for (let i = 0; i < this._users.length; i++) {
      if (user.id === this._users[i].id) {
        this._users[i] = user;
        break;
      }
    }
  }

  removeUser(user: any): void {
    for (let i = 0; i < this._users.length; i++) {
      if (user.id === this._users[i].id) {
        const sliced = this._users.splice(i, 1);
        break;
      }
    }
  }

  getUsers(): Array<any> {
    const sortedUsers =  (this._users && this._users.length > 0) ? this._users.sort( (a,b) => a.id > b.id ? -1 : 0) :
    this._users;
    return sortedUsers;
  }

  login(login: Authentication): Observable<any> {
    const loggedInUser = (login.UserName && login.EmailAddress) ? 
    this._users.filter( (user:UserOptions) => 
    (user.UserName === login.UserName) && 
    (user.EmailAddress === login.EmailAddress) )  : null;

    const UserName =  (loggedInUser && loggedInUser.length > 0) ? loggedInUser[0].UserName : null;
    const authenticated = (UserName && UserName.length > 0) ?  {authenticated: true, UserName : UserName} : {authenticated: false, UserName : UserName};
   
    const promiseResult = this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(UserName);
    });

    return of(authenticated);
  }

  signup(user: UserOptions): Promise<any> {
    this.addUser(user);
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(user.UserName);
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('UserName');
    }).then(() => {
    });
  }

  setUsername(UserName: string): Promise<any> {
    return this.storage.set('UserName', UserName);
  }

  getUsername(): Promise<string> {
    return this.storage.get('UserName').then((value) => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

}
