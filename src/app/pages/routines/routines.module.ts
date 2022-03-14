import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbDatepickerModule,
  NbSearchModule,
  NbAlertModule,
  NbCheckboxModule,
  NbRadioModule,
  NbSelectModule,
  NbDialogModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {RoutineService} from './routines.service';
import {RoutinesRoutingModule, routedComponents} from './routines-routing.module';
import {CrudService} from '../../provider/crud.service';
import {RoutinesComponent} from './routines.component';
import {StaticSelect} from '../../@core/data/static-select';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbActionsModule,
    NbButtonModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbInputModule,
    NbDatepickerModule,
    NbAlertModule,
    NbCheckboxModule,
    NbRadioModule,
    NbSelectModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    RoutinesRoutingModule,
    NbDialogModule.forChild(),
  ],
  declarations: [
    ...routedComponents,
    RoutinesComponent,
  ],
  providers: [
    RoutineService,
    CrudService,
    StaticSelect,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
})
export class RoutinesModule { }
