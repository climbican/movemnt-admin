/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component} from '@angular/core';
import { AuthenticationService } from './provider/authentication.service';
import { Token } from './models/token';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet><ngx-loading-screen></ngx-loading-screen>',
})
export class AppComponent {
  currentToken: Token;
  constructor(private auth: AuthenticationService, private router: Router) {}
  // LOGOUT FUNCTION
  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
