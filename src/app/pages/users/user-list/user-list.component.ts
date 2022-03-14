/**
 * Name: Customer List
 *
 * Description: THIS WILL PROCESS TRANSACTIONS THAT COME IN FROM THE WEB SITE.
 * !!IMPORTANT NOTE: EACH FUNCTION WILL NEED TO AGGREGATE TO THE RESPECTIVE GATEWAY.
 *
 *
 * Copyright (c) 2019. All Code is the property of FitnessFeed unless unless otherwise specified by contract.
 *
 *          (\ /)
 *          (O .o)
 *          (> '<)
 *          (_/\_)
 *      ]) o 0 []v[]
 *
 * @author Michael Rumack
 * @company FitnessFeed
 * User: climbican
 * Date: 2/5/16
 * Time: 2:35 PM
 * Last Mod:
 * Notes:
 */
import {Component, ViewChild} from '@angular/core';
import {UserService} from '../../../provider/user.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTable} from '@angular/material/table';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../../provider/authentication.service';

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  title: string;
  telephone: string;
  countryId: string;
  state: string;
  company: string;
  create_dte: string;
}

@Component({
  selector: 'ngx-user-list',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserListComponent {
  dataSource: any;
  columnsToDisplay = ['id', 'name', 'email', 'actions'];
  expandedElement: ContactData | null;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  constructor(private us: UserService, private router: Router, private auth: AuthenticationService) {
    // clientId = 0 for fetching full list
    us.fetch(0)
      .subscribe( (data) => {
        if (data.status === 200) {
          this.dataSource = data.data;
        } else if (data.status === 401) {
          // need to call logout...
          this.auth.logout();
          this.router.navigateByUrl('/login');
        }
        // console.log('single field >>> ' + this.users[0].name);
      });
  }

  onDeleteConfirm(id: number): void {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      this.us.remove(id)
        .subscribe( (res) => {
          if (parseInt(res.status, 10) === 200) {
              const index = this.dataSource.findIndex(d => d.id === id);
              this.dataSource.splice(index, 1);
              this.table.renderRows();
          } else if (res.status === 401) {
            // need to call logout...
            this.auth.logout();
            this.router.navigateByUrl('/login');
          } else {
            alert('There was an issue removing this object');
          }
        });
    } else {
      // event.confirm.reject();
    }
  }
}
