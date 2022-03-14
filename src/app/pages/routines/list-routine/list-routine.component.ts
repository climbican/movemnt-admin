/**
 * Name: Routine List
 *
 * Description:
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
 * SELECT t.id AS taskId, t. milestones_id AS milestoneId, t.title AS taskTitle, t.status AS taskStatus,
 * t.start_date AS taskStartDate, t.end_date AS taskEndDate,
 t.hours_to_complete_projected AS hoursToCompleteProjected, t.hourly_rate AS hourlyRate,
 t.client_access AS clientAccess, p.title AS projectTitle, u.name AS clientName
 FROM routines t
 INNER JOIN projects p
 ON p.id = t.project_id
 INNER JOIN users u
 ON u.id = p.client_id;

 {'taskId':1,'milestoneId':null,'taskTitle':'Create questions model','taskStatus':'pending',
 'taskStartDate':'2019-11-13','taskEndDate':'2019-11-13',
 s'hoursToCompleteProjected':1,'hourlyRate':50,'clientAccess':'no',
 'taskDescription':'Create model ','projectTitle':'Fitness feed app eco system','clientName':'Mitch Casillas'}

 */
import {Component, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTable} from '@angular/material/table';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../provider/authentication.service';
import {RoutineModel} from '../../../models/RoutineModel';
import {RoutineService} from '../routines.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
    selector: 'ngx-routines-list',
    templateUrl: './list-routine.component.html',
    styleUrls: ['./list-routine.component.scss'],
})
export class ListRoutineComponent {
    dataSource: any;
    // id, create_dte AS createdOn, last_update AS lastUpdate, start_date AS startDate, deadline, client_id AS clientId,
    // 		title, description, status
    columnsToDisplay = ['id', 'title', 'authorName', 'createDate', 'actions'];
    expandedElement: RoutineModel | null;
    @ViewChild(MatTable, {static: true}) table: MatTable<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private ts: RoutineService, private router: Router, private auth: AuthenticationService) {
        // projectId = 0 for fetching full list
        ts.fetch(0)
            .subscribe((data) => {
                if (data.status === 200) {
                    this.dataSource = new MatTableDataSource(data.data);
                    this.dataSource.paginator = this.paginator;
                } else if (data.status === 401) {
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
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onDeleteConfirm(id: number): void {
        if (window.confirm('Are you sure you want to delete this Routine?')) {
            this.ts.remove(id)
                .subscribe((res) => {
                    if (res.status === 200) {
                        const index = this.dataSource.findIndex(d => d.id === id);
                        this.dataSource.splice(index, 1);
                        this.table.renderRows();
                    } else if (res.status === 401) {
                        // need to call logout...
                        this.auth.logout();
                        this.router.navigateByUrl('/login');
                    } else {
                        alert('There was an issue removing this Routine');
                    }
                });
        } else {
            // event.confirm.reject();
        }
    }
}
