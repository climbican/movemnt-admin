import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import { Observable, from} from 'rxjs';
import { AuthenticationService} from '../provider/authentication.service';
import {Router} from '@angular/router';
import {DataService} from '../provider/data.service';
import {Token} from '../models/token';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private currentToken: Token;
  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private dataService: DataService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const token: Token = await this.authenticationService.fetchToken();
    if (!token) {
      this.dataService.currentData
        .subscribe( t => {
          if (t.paramName === 'token') {
            this.currentToken = t.paramValue;
          } else {
            this.currentToken = null;
          }
        });
    } else {
      this.currentToken = token;
    }

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.currentToken.token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return next.handle(request).toPromise();
  }
}
