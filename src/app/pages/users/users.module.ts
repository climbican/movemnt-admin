import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbPopoverModule,
  NbSearchModule,
  NbAlertModule,
  NbCheckboxModule,
  NbSelectModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import {UsersRoutingModule, routedComponents} from './users-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../provider/user.service';
import {Countries} from '../../@core/data/countries';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// interestingly this does not trickle down from app.module....
import {JwtInterceptor} from '../../helpers/jwt.interceptors';
import {ErrorInterceptor} from '../../helpers/errors.interceptors';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbActionsModule,
    NbButtonModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    NbCheckboxModule,
    NbSelectModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    UserService,
    Countries,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
})
export class UsersModule { }
