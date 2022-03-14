import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'ngx-auth-pages',
  styleUrls: ['auth.component.scss'],
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-card>
          <nb-card-header>
            <nav class="navigation">
              <a href="#" (click)="back()" class="link back-link" aria-label="Back">
                <nb-icon icon="arrow-back"></nb-icon>
              </a>
            </nav>
          </nb-card-header>
          <nb-card-body>
            <ngx-auth-block>
              <router-outlet center></router-outlet>
            </ngx-auth-block>
          </nb-card-body>
        </nb-card>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class AuthComponent implements OnDestroy {
  private alive = true;

  subscription: any;
  constructor(private location: Location) {}

  authenticated: boolean = false;
  token: string = '';
  back() {
    this.location.back();
    return false;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
