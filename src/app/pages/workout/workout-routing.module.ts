import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WorkoutComponent} from './workout.component';
import {ListWorkoutComponent} from './list-workout/list-workout.component';
import {AddWorkoutComponent} from './add-workout/add-workout.component';
import {EditWorkoutComponent} from './edit-workout/edit-workout.component';

const routes: Routes = [{
  path: '',
  component: WorkoutComponent,
  children: [
    {
      path: 'list',
      component: ListWorkoutComponent,
    },
    {
      path: 'add',
      component: AddWorkoutComponent,
    },
    {
      path: 'edit/:id',
      component: EditWorkoutComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutRoutingModule { }

export const routedComponents = [
  WorkoutComponent,
  AddWorkoutComponent,
  EditWorkoutComponent,
  ListWorkoutComponent,
];
