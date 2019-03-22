import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserEntity } from '../_models/UserEntity';
import { map } from 'rxjs/operators';
import { MatSnackBarComponent } from '../service/mat-snack-bar/mat-snack-bar.component';


@Injectable()
export class AuthenticationService {

  user: UserEntity;
  //API_URL: string = "http://ec2-18-220-6-166.us-east-2.compute.amazonaws.com:8080/";
  //API_URL: string = "http://localhost:8080/";
   API_URL: string = "http://cdfw-alb-prod-775994205.us-west-1.elb.amazonaws.com:9301/";

  constructor(private http: HttpClient, private snackBar: MatSnackBarComponent) { }

  login(username: string, password: string) {
    var self = this;
    return this.http.post<UserEntity>(this.API_URL + 'authenticateUser', { username: username, password: password }).
      toPromise()
      .then(function (response) {
        if (response) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          return true;
        }
        return false;
      }, function (error) {
        return error;
      });

  }

  resetPassword(username: string, password: string, newpassword: string) {
    var self = this;
    console.log(username + ', ' + password);
    return this.http.post<UserEntity>(this.API_URL + 'resetPassword', { username: username, password: password, newpassword: newpassword });
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

}
