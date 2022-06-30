import { Injectable } from '@angular/core';
import { StorageService } from './storage-service';
import { Authentication } from '../models/authentication';
import { Observable, from, of } from 'rxjs';
import { UserOptions } from '../models/user-options';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  _users: Array<UserOptions> = [{
    id: '1',
    username: 'admin',
    emailaddress: "password",
    
  }, {
    id: '2',
    username: 'Jekyll Hyde',
    emailaddress: "",
    
  }, {
    id: '3',
    username: 'Storm Trooper',
    emailaddress: "",
    
  }, {
    id: '4',
    username: 'Lennox Lewis',
    emailaddress: "",
    
  }];


  constructor(
    public storage: StorageService,
    private http: HttpClient
  ) { }

  hasUser(user: any): boolean {
    return (this._users.indexOf(user) > -1);
  }

  addUser(user: any): void {
    this._users.push(user);
  }

  updateUser(user: any): void {
    /*
    const index = this._users.indexOf(user);
    if (index > -1) {
      this._users.splice(index, 1);
    }
    */
    for (let i = 0; i < this._users.length; i++) {
      if (user.id === this._users[i].id) {
        this._users[i] = user;
        break;
      }
    }
  }

  removeUser(user: any): void {
    /*
    const index = this._users.indexOf(user);
    if (index > -1) {
      this._users.splice(index, 1);
    }
    */
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

  login(login: Authentication): Promise<any> {
    const username = login.username;
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      //return window.dispatchEvent(new CustomEvent('user:login'));
    });
  }

  loginObservable(login: Authentication): Observable<any> {
    const loggedInUser = (login.username && login.emailaddress) ? 
    this._users.filter( (user:UserOptions) => 
    (user.username === login.username) && 
    (user.emailaddress === login.emailaddress) )  : null;

    const username =  (loggedInUser && loggedInUser.length > 0) ? loggedInUser[0].username : null;
    const authenticated = (username && username.length > 0) ?  {authenticated: true, username : username} : {authenticated: false, username : username};
    
    console.log({
      loggedInUser: loggedInUser, login:login, users: this._users,  authenticated: authenticated
    })
    
   
    const promiseResult = this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      //return window.dispatchEvent(new CustomEvent('user:login'));
      this.loginNodeApiObservable(login).subscribe();
    });

    return of(authenticated);
  }

  loginNodeApiObservable(login: Authentication): Observable<any> {
    let loggedInUser = null;

    return new Observable((subscriber) => {
      this.http.post('http://localhost:3011/api/login/authenticate/1DC52158-0175-479F-8D7F-D93FC7B1CAA4', login).subscribe((data:any) => {
        const authId = data.AuthID;
        console.log({ loginNodeApiObservable: data, authId: authId });

        this.postAuthToken(authId).subscribe( () =>{

        });
        subscriber.next(true);
      }, () => {
        subscriber.error();
      }
      )
    });
  }

  postAuthToken(authId: string): Observable<any> {
    const options = { headers: new HttpHeaders({ 'authid': authId  }) };

    return new Observable((subscriber) => {
      this.http.post('http://localhost:3011/api/login/authorize/1DC52158-0175-479F-8D7F-D93FC7B1CAA4', {}, options).subscribe((data: any) => {
        console.log({ postAuthToken: data, authId: authId });
        subscriber.next(true);
      }, () => {
        subscriber.error();
      }
      )
    });

  }

  

  signup(user: UserOptions): Promise<any> {
    this.addUser(user);
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(user.username);
      //return window.dispatchEvent(new CustomEvent('user:signup'));
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('username');
    }).then(() => {
      //window.dispatchEvent(new CustomEvent('user:logout'));
    });
  }

  setUsername(username: string): Promise<any> {
    return this.storage.set('username', username);
  }

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}
