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
import {MatTable} from '@angular/material/table';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../provider/authentication.service';
import {CrudService} from '../../../provider/crud.service';
import {LoadingScreenService} from '../../../provider/loading-screen/loading-screen.service';
import {MatPaginator} from '@angular/material/paginator';
import {WorkoutModel} from '../../../models/workout.model';
import {MatTableDataSource} from '@angular/material/table';

@Component({
    selector: 'ngx-equipment-list',
    templateUrl: 'equipment-list.component.html',
    styleUrls: ['equipment-list.component.scss'],
})
export class EquipmentListComponent {
    dataSource: any;
    matTableData: any;
    previewUrl: string = 'assets/images/no-image-300x300.png';
    // id, create_dte AS createdOn, last_update AS lastUpdate, start_date AS startDate, deadline, client_id AS clientId,
    // 		title, description, status
    columnsToDisplay = ['imageLink', 'id', 'name', 'createdOn', 'actions'];
    @ViewChild(MatTable, {static: true}) table: MatTable<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private crud: CrudService,
                private router: Router,
                private auth: AuthenticationService,
                private loadingService: LoadingScreenService) {
        this.loadingService.startLoading();
        // projectId = 0 for fetching full list
        crud.fetch(0, 'equipment', 'list')
            .subscribe((data) => {
                if (parseInt(data.status, 10) === 200) {
                    this.dataSource = data.data;
                    this.matTableData = new MatTableDataSource(data.data);
                    this.matTableData.paginator = this.paginator;
                    setTimeout(() => {
                        this.loadingService.stopLoading();
                    }, 4000);
                } else if (parseInt(data.status, 10) === 401) {
                    // need to call logout...
                    this.auth.logout();
                    this.router.navigateByUrl('/login');
                }
                // console.log('single field >>> ' + this.users[0].name);
            });
    }
    /**
     * @desc Apply filter to list table
     * @param event
     */
    applyFilter(event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.matTableData.filter = filterValue.trim().toLowerCase();
    }

    onDeleteConfirm(id: number): void {
        if (window.confirm('Are you sure you want to delete this piece of equipment?')) {
            this.crud.remove(id, 'equipment', 'remove')
                .subscribe((res) => {
                    if (parseInt(res.status, 10) === 200) {
                        const index = this.dataSource.findIndex(d => d.id === id);
                        this.dataSource.splice(index, 1);
                        this.matTableData = new MatTableDataSource(this.dataSource);
                        this.table.renderRows();
                    } else if (parseInt(res.status, 10) === 401) {
                        // need to call logout...
                        this.auth.logout();
                        this.router.navigateByUrl('/login').then(() => {
                        });
                    } else {
                        alert('There was an issue removing this entry');
                    }
                });
        } else {
            // event.confirm.reject();
        }
    }
}
