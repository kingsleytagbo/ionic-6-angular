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
  authenticationId = null;

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
    this.postUser(this.authenticationId, user).subscribe(() => {
      this.populateUsers();
    });
    //this._users.push(user);
    // console.log({ user: user })
  }

  updateUser(user: any): void {
    this.putUser(this.authenticationId, user.id, user).subscribe(() => {
      this.populateUsers();
    });
    /*
    for (let i = 0; i < this._users.length; i++) {
      if (user.id === this._users[i].id) {
        this._users[i] = user;
        break;
      }
    }
    */
  }

  removeUser(user: any): void {
    for (let i = 0; i < this._users.length; i++) {
      if (user.id === this._users[i].id) {
        const sliced = this._users.splice(i, 1);
        console.log({removeUser: user})
        this.deleteUser(this.authenticationId, user.id).subscribe( () =>{});
        break;
      }
    }
  }

  getUsers(): Array<any> {
    const sortedUsers =  (this._users && this._users.length > 0) ? this._users.sort( (a,b) => a.id > b.id ? -1 : 0) :
    this._users;
    return sortedUsers;
  }

  loginLocalOnly(login: Authentication): Promise<any> {
    const username = login.username;
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      //return window.dispatchEvent(new CustomEvent('user:login'));
    });
  }

  loginLocalObservable(login: Authentication): Observable<any> {
    const loggedInUser = (login.username && login.emailaddress) ? 
    this._users.filter( (user:UserOptions) => 
    (user.username === login.username) && 
    (user.emailaddress === login.emailaddress) ) : null;


    const username =  (loggedInUser && loggedInUser.length > 0) ? loggedInUser[0].username : null;
    const authenticated = (username && username.length > 0) ?  {authenticated: true, username : username} : {authenticated: false, username : username};
    /*
    console.log({
      loggedInUser: loggedInUser, login:login, users: this._users,  authenticated: authenticated
    })
    */
   
    const promiseResult = this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      //return window.dispatchEvent(new CustomEvent('user:login'));
      //this.loginNodeApiObservable(login).subscribe();
    });

    return of(authenticated);
  }

  login(login: Authentication): Observable<any> {

    return new Observable((subscriber) => {
      this.http.post('http://localhost:3010/api/login/authenticate/1DC52158-0175-479F-8D7F-D93FC7B1CAA4', login).subscribe((data: any) => {
        const response = (data && data.AuthID) ? { authenticated: true, username: data.UserName } : { authenticated: false, username:null };
        if (response.authenticated) {
          // login is successful
          this.authenticationId = data.AuthID;
          this.populateUsers();
          const username = data.UserName;

          console.log({
            loggedInUser: { login: login, data: data, users: this._users }
          })

          this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
            this.setUsername(username);
          });

        }
        else {
          this.storage.set(this.HAS_LOGGED_IN, false);
        }

        //return of(authenticated);

        /**
         this.postUser(this.authenticationId, login).subscribe( () =>{});
         this.putUser(this.authenticationId, '1', {firstname:'admin', lastname:'user'}).subscribe( () =>{});
         this.getAllUsers(this.authenticationId).subscribe( () =>{});
         this.deleteUser(this.authenticationId, '3').subscribe( () =>{});
         this.getOneUser(this.authenticationId, '1').subscribe( () =>{});
         this.postAuthToken(this.authenticationId).subscribe( () =>{});
         **/

        subscriber.next(response);
      }, (error:any) => {
        subscriber.error();
      }
      )
    });
  }

  postAuthToken(authId: string): Observable<any> {
    const options = { headers: new HttpHeaders({ 'authid': authId  }) };

    return new Observable((subscriber) => {
      this.http.post('http://localhost:3010/api/login/authorize/1DC52158-0175-479F-8D7F-D93FC7B1CAA4', {}, options).subscribe((data: any) => {
        console.log({ postAuthToken: data, authId: authId });
        subscriber.next(true);
      }, () => {
        subscriber.error();
      }
      )
    });

  }


  postUser(authId: string, body:any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'authid': authId  }) };

    return new Observable((subscriber) => {
      this.http.post('http://localhost:3010/api/users/1DC52158-0175-479F-8D7F-D93FC7B1CAA4', body, options).subscribe((data: any) => {
        console.log({ postUser: data, authId: authId });
        subscriber.next(true);
      }, () => {
        subscriber.error();
      }
      )
    });

  }

  putUser(authId: string, id:string, body:any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'authid': authId  }) };

    return new Observable((subscriber) => {
      this.http.put('http://localhost:3010/api/users/1DC52158-0175-479F-8D7F-D93FC7B1CAA4/' + id, body, options).subscribe((data: any) => {
        console.log({ putUser: data, authId: authId });
        subscriber.next(true);
      }, () => {
        subscriber.error();
      }
      )
    });

  }

  deleteUser(authId: string, id:string): Observable<any> {
    const options = { headers: new HttpHeaders({ 'authid': authId  }) };

    return new Observable((subscriber) => {
      this.http.delete('http://localhost:3010/api/users/1DC52158-0175-479F-8D7F-D93FC7B1CAA4/' + id, options).subscribe((data: any) => {
        //console.log({ deleteUser: data, authId: authId });
        subscriber.next(true);
      }, () => {
        subscriber.error();
      }
      )
    });

  }

  getOneUser(authId: string, id:string): Observable<any> {
    const options = { headers: new HttpHeaders({ 'authid': authId  }) };

    return new Observable((subscriber) => {
      this.http.get('http://localhost:3010/api/users/1DC52158-0175-479F-8D7F-D93FC7B1CAA4/' + id, options).subscribe((data: any) => {
        console.log({ getOneUser: data, authId: authId });
        subscriber.next(true);
      }, () => {
        subscriber.error();
      }
      )
    });

  }

  getAllUsers(authId: string, pagenum?:number): Observable<any> {
    const options = { headers: new HttpHeaders({ 'authid': authId  }) };

    return new Observable((subscriber) => {
      this.http.get('http://localhost:3010/api/users/1DC52158-0175-479F-8D7F-D93FC7B1CAA4/page/'+ (pagenum ?? 1), options).subscribe((data: any) => {
        //console.log({ getAllUsers: data, authId: authId });
        subscriber.next(data);
      }, () => {
        subscriber.error();
      }
      )
    });

  }

  populateUsers(){
    this.getAllUsers(this.authenticationId).subscribe((items: Array<any>) => {
      if (items && items.length > 0) {
       if(this._users && this._users.length > 0){
        this._users.splice(0,this._users.length);
       }
        items.forEach( (item:any) => {
          const user = Object.assign(
            {id: item.ITCC_UserID, username: item.UserName, emailaddress: item.EmailAddress}, item);
          this._users.push(user);
        });
      }
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

}
