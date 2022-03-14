import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import {WorkoutComponent} from './workout/workout.component';
import {EquipmentComponent} from './equipment/equipment.component';
import {UsersComponent} from './users/users.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {RoutinesComponent} from './routines/routines.component';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'users',
      component: UsersComponent,
      loadChildren: () => import('./users/users.module')
        .then(m => m.UsersModule),
      // canActivate: [AuthGuard],
    },
    {
      path: 'equipment',
      component: EquipmentComponent,
      loadChildren: () => import('./equipment/equipment.module')
        .then(m => m.EquipmentModule),
    },
    {
      path: 'workouts',
      component: WorkoutComponent,
      loadChildren: () => import('./workout/workout.module')
        .then(m => m.WorkoutModule),
    },
    {
      path: 'routines',
      component: RoutinesComponent,
      loadChildren: () => import('./routines/routines.module')
          .then( m => m.RoutinesModule),
    },
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
