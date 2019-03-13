import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  count = 0;
  constructor(private spinner: NgxSpinnerService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var user = JSON.parse(localStorage.getItem('currentUser'));
    req = req.clone({
        setHeaders: {
            Authorization: 'Bearer '+ (user !== null ? user.userToken : '')
        }
    });

    this.spinner.show()

    this.count++;

    return next.handle(req)
            .pipe ( tap (
                    event => console.log(event),
                    error => console.log( error )
                ), finalize(() => {
                    this.count--;
                    if ( this.count == 0 ) this.spinner.hide ()
                })
            );
  }
}