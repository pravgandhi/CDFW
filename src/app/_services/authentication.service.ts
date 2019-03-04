import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserEntity } from '../_models/UserEntity';
import {map} from 'rxjs/operators';
import { MatSnackBarComponent } from '../service/mat-snack-bar/mat-snack-bar.component';


@Injectable()
export class AuthenticationService {

    user: UserEntity;

    constructor(private http: HttpClient, private snackBar: MatSnackBarComponent) { }

      login(username: string, password: string) {
          var self = this;
          return this.http.post<UserEntity>('http://localhost:8080/authenticateUser', {username: username, password: password}).
          toPromise()
         .then(function(response) {
           console.log(response);
           if(response) {
             localStorage.setItem('currentUser', JSON.stringify(response));
             return true;
           }
           return false;
         } , function(error) {
           console.log(error);
            return error;
         });

       }

      logout() {
          localStorage.removeItem('currentUser');
      }


}
