import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NbActionsModule, NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbLayoutModule,
} from '@nebular/theme';
import {LoginComponent} from './login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    imports: [
      FormsModule,
      ReactiveFormsModule,
      NbActionsModule,
      NbButtonModule,
      NbCardModule,
      NbCheckboxModule,
      NbDatepickerModule,
      NbIconModule,
      NbInputModule,
      NbRadioModule,
      NbSelectModule,
      NbUserModule,
      NbAlertModule,
      NbLayoutModule,
      CommonModule,
    ],
    declarations: [
      LoginComponent,
    ],
})
export class LoginModule { }
