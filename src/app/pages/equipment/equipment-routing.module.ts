import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EquipmentListComponent} from './list/equipment-list.component';
import {EquipmentComponent} from './equipment.component';
import {EditEquipmentComponent} from './edit-equipment/edit-equipment.component';
import {AddEquipmentComponent} from './add-equipment/add-equipment.component';

const routes: Routes = [{
  path: '',
  component: EquipmentComponent,
  children: [
    {
      path: 'list',
      component: EquipmentListComponent,
    },
    {
      path: 'add',
      component: AddEquipmentComponent,
    },
    {
      path: 'edit/:id',
      component: EditEquipmentComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentRoutingModule { }

export const routedComponents = [
  EquipmentComponent,
  EquipmentListComponent,
  AddEquipmentComponent,
  EditEquipmentComponent,
];
