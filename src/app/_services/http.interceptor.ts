import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(){

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var user = JSON.parse(localStorage.getItem('currentUser'));
    req = req.clone({
        setHeaders: {
            Authorization: 'Bearer '+ (user !== null ? user.userToken : '')
        }
    });

    return next.handle(req);
  }
}