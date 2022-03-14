import {NgModule} from '@angular/core';
import {NbMenuModule} from '@nebular/theme';
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
import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {NotFoundComponent} from './not-found/not-found.component';
import {WorkoutModule} from './workout/workout.module';
import {UsersModule} from './users/users.module';
import {EquipmentModule} from './equipment/equipment.module';
import {RoutinesModule} from './routines/routines.module';
import {DashboardModule} from './dashboard/dashboard.module';

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        NbMenuModule,
        DashboardModule,
        UsersModule,
        EquipmentModule,
        MatTableModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        NbActionsModule,
        NbButtonModule,
        NbCardModule,
        NbIconModule,
        NbPopoverModule,
        NbSearchModule,
        NbAlertModule,
        NbCheckboxModule,
        NbSelectModule,
        WorkoutModule,
        RoutinesModule,
    ],
    declarations: [
        PagesComponent, NotFoundComponent,
    ],
})
export class PagesModule {
}
