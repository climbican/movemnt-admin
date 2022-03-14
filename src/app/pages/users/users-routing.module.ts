import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from './users.component';
import {UserListComponent} from './user-list/user-list.component';
import {AddUserComponent} from './user-add/add-user.component';
import {UserEditComponent} from './user-edit/user-edit.component';

const routes: Routes = [{
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'list',
        component: UserListComponent,
      },
      {
        path: 'add',
        component: AddUserComponent,
      },
      {
        path: 'edit/:id',
        component: UserEditComponent,
      },
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }

export const routedComponents = [
    UsersComponent,
    UserListComponent,
    UserEditComponent,
    AddUserComponent,
];
