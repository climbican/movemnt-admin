/*
 * {"data":{
 * "token_type":"Bearer",
 * "expires_in":1296000,
 * "access_token":
 * token_received
 * token_origin
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService} from '../provider/authentication.service';
import {Token} from '../models/token';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private currentToken: Token;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
             return this.authenticationService.fetchToken()
            .then(data => {
                if (data.token !== '') {
                    return true;
                } else { return false; }
            });

        // not logged in so redirect to login page with the return url
        // this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        // return false;
    }
}
