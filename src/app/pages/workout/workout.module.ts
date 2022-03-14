import {NgModule} from '@angular/core';
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
} from '@nebular/theme';
import {ThemeModule} from '../../@theme/theme.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
// interestingly this does not trickle down from app.module....
import {JwtInterceptor} from '../../helpers/jwt.interceptors';
import {ErrorInterceptor} from '../../helpers/errors.interceptors';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {WorkoutRoutingModule, routedComponents} from './workout-routing.module';
import {CrudService} from '../../provider/crud.service';
import {WorkoutService} from './workout.service';
import {WorkoutComponent} from './workout.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

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
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        WorkoutRoutingModule,
        CKEditorModule,
    ],
    declarations: [
        ...routedComponents,
        WorkoutComponent,
    ],
    providers: [
        WorkoutService,
        CrudService,
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    ],
})
export class WorkoutModule {
}
