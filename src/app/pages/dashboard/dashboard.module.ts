import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {NbCardModule} from '@nebular/theme';
import {CrudService} from '../../provider/crud.service';

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        NbCardModule,
    ],
    providers: [CrudService],
})
export class DashboardModule {
}
