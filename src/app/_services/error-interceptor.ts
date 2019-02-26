import { HttpEvent,
         HttpInterceptor,
         HttpHandler,
         HttpRequest,
         HttpResponse,
         HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBarComponent } from '../service/mat-snack-bar/mat-snack-bar.component';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptor  implements HttpInterceptor {

constructor( private snackBar: MatSnackBarComponent) {

}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    return next.handle(request)
               .pipe(
                 catchError( (error: HttpErrorResponse) => {
                    let errMsg = '';
                    // Client Side Error
                    if (error.error instanceof ErrorEvent) {
                      errMsg = `Error: ${error.error.message}`;
                    }
                    else {  // Server Side Error
                      errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                    }
                    // show error snackbar with red background
	          	      this.snackBar.openSnackBar('We are experiencing technical difficulties.','Close','red-snackbar');

                    // return an observable
                    return throwError(errMsg);
                  })
               )
  }
}
