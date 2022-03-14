/**
 Server Unauthenticated or 401 returns the following

 errors {"headers":{"normalizedNames":{},"lazyUpdate":null},"status":401,
        "statusText":"Unauthorized",
        "url":"http://localhost/fitnessfeed/public/api/user/profile",
        "ok":false,"name":"HttpErrorResponse",
        message":"Http failure response for http://localhost/fitnessfeed/public/api/user/profile: 401 Unauthorized",
        "error":{"message":"Unauthenticated."}}

 todo: look into rollbar for error reportng
 https://rollbar.com/blog/error-handling-with-angular-8-tips-and-best-practices/
 */

import { Injectable } from '@angular/core';
import { HttpRequest,
    HttpResponse,
    HttpErrorResponse,
    HttpHandler,
    HttpEvent,
    HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, timeout } from 'rxjs/operators';
import { AuthenticationService} from '../provider/authentication.service';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                timeout(6000),
                retry(1),
                catchError((err: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (err.error instanceof ErrorEvent) {
                        errorMessage = `Error: ${err.error.message}`;
                    }
                    else {
                        if (err.status === 401) {
                            // auto logout if 401 response returned from api
                            this.router.navigate(['/login']);
                        }
                        try {
                            if (err.hasOwnProperty('message')) {
                                errorMessage = err.error.message;
                            } else {
                                errorMessage = err.statusText;
                            }
                        } catch (error) {
                            errorMessage = err.statusText;
                        }
                    }
                    return throwError(errorMessage);
                }));
    }
}
