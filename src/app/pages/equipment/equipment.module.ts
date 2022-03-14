import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbSearchModule,
  NbAlertModule,
  NbCheckboxModule,
  NbRadioModule,
  NbSelectModule, NbDatepickerModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import {EquipmentRoutingModule, routedComponents} from './equipment-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// interestingly this does not trickle down from app.module....
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {EquipmentComponent} from './equipment.component';
import {CrudService} from '../../provider/crud.service';
import {JwtInterceptor} from '../../helpers/jwt.interceptors';
import {ErrorInterceptor} from '../../helpers/errors.interceptors';

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
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    EquipmentRoutingModule,
    MatTableModule,
  ],
  declarations: [
    ...routedComponents,
    EquipmentComponent,
  ],
  providers: [
    CrudService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
})
export class EquipmentModule { }
