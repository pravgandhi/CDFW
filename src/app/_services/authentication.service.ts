import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserEntity } from '../_models/UserEntity';
import {map} from 'rxjs/operators';


@Injectable()
export class AuthenticationService {

    user: UserEntity;

    constructor(private http: HttpClient) { }

      login(username: string, password: string) {
          var self = this;
          return this.http.post<UserEntity>('http://USLMAPRAVGANDH2:8080/authenticateUser', {username: username, password: password}).
          toPromise()
         .then(function(response) {
           if(response) {
             console.log(response['userName']);
             localStorage.setItem('currentUser', JSON.stringify(response));
             return true;
           }
           return false;
         } , function(error) {

         });

       }

      logout() {
          localStorage.removeItem('currentUser');
      }


}
