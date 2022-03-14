import {NgModule} from '@angular/core';
import {
  NbAlertModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbCheckboxModule,
  NbInputModule,
  NbButtonModule,
} from '@nebular/theme';
import {AuthComponent} from './auth.component';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginModule} from './login/login.module';
import {NgxAuthBlockComponent} from './auth-block/auth-block.component';

const NB_MODULES = [
  NbIconModule,
  NbLayoutModule,
  NbCardModule,
  NbAlertModule,
  NbCheckboxModule,
  NbInputModule,
  NbButtonModule,
];

@NgModule({
  imports: [
    AuthRoutingModule,
    ...NB_MODULES,
    LoginModule,
  ],
  declarations: [
    AuthComponent,
    NgxAuthBlockComponent,
  ],
})
export class AuthModule {
}
