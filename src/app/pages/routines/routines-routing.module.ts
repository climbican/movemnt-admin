import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListRoutineComponent} from './list-routine/list-routine.component';
import {RoutinesComponent} from './routines.component';
import {AddRoutineComponent} from './add-routine/add-routine.component';
import {EditRoutineComponent} from './edit-routine/edit-routine.component';
import {WorkoutTypes} from '../../@core/data/workout-types';

const routes: Routes = [{
  path: '',
  component: RoutinesComponent,
  children: [
    {
      path: 'list',
      component: ListRoutineComponent,
    },
    {
      path: 'add',
      component: AddRoutineComponent,
    },
    {
      path: 'edit/:id',
      component: EditRoutineComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [WorkoutTypes],
})
export class RoutinesRoutingModule { }

export const routedComponents = [
  ListRoutineComponent,
  RoutinesComponent,
  AddRoutineComponent,
  EditRoutineComponent,
];
