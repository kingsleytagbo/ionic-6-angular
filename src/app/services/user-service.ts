import { Injectable } from '@angular/core';
import { StorageService } from './storage-service';
import { Authentication } from '../models/authentication';
import { Observable, from, of } from 'rxjs';
import { UserOptions } from '../models/user-options';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  authenticationId = null;

  _users: Array<UserOptions> = [];


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
  }

  updateUser(user: any): void {
    this.putUser(this.authenticationId, user.id, user).subscribe(() => {
      this.populateUsers();
    });
  }

  removeUser(user: any): void {
    this.deleteUser(this.authenticationId, user.id).subscribe( () =>{
      this.populateUsers();
    });
  }

  getUsers(): Array<any> {
    const sortedUsers =  (this._users && this._users.length > 0) ? this._users.sort( (a,b) => a.id > b.id ? -1 : 0) :
    this._users;
    return sortedUsers;
  }


getBasicAuthenticationHeaderOptions(login: Authentication){
  // 'Authorization': 'Basic ' + btoa('username:password')
  let result:any = null;
  if(login){
    result = {'Authorization': 'Basic ' + btoa(login.username + ':' + login.emailaddress)};
  }
  return result;
}
  login(login: Authentication): Observable<any> {
    this._users = [];
    return new Observable((subscriber) => {
      const basicAuthenticationOptions =  this.getBasicAuthenticationHeaderOptions(login);
      //console.log({Authorization: basicAuthenticationOptions});

      this.http.post(`${environment.apiUrl}` + '/login/authenticate/' + '1DC52158-0175-479F-8D7F-D93FC7B1CAA4', null, {headers: basicAuthenticationOptions}).subscribe((data: any) => {
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
      this.http.post(`${environment.apiUrl}` + '/login/authorize/' + `${environment.siteId}`, {}, options).subscribe((data: any) => {
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
      this.http.post(`${environment.apiUrl}` + '/users/' + `${environment.siteId}`, body, options).subscribe((data: any) => {
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
      this.http.put(`${environment.apiUrl}` + '/users/' + `${environment.siteId}` + '/' + id, body, options).subscribe((data: any) => {
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
      this.http.delete(`${environment.apiUrl}` + '/users/' + `${environment.siteId}` + '/' + id, options).subscribe((data: any) => {
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
      this.http.get(`${environment.apiUrl}` + '/users/' + `${environment.siteId}`+ '/' + id, options).subscribe((data: any) => {
        console.log({ getOneUser: data, authId: authId });
        subscriber.next(true);
      }, () => {
        subscriber.error();
      }
      )
    });

  }

  getAllUsers(authId: string, pagenum?:number): Observable<any> {
    const options = { headers: new HttpHeaders({ 'authid': authId + "-X"  }) };

    return new Observable((subscriber) => {
      this.http.get(`${environment.apiUrl}` + '/users/' + `${environment.siteId}` + '/page/'+ (pagenum ?? 1), options).subscribe((data: any) => {
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
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('username');
    }).then(() => {
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
