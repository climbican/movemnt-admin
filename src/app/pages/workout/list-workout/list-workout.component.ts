/**
 * Name: Workout List
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
 *['id', 'title', 'sub_title', 'trainer_credit_text', 'owner_link', 'main_muscle_group',
 'secondary_muscle_group_id', 'recommended_interval', 'exercise_type', 'equipmemt_type', 'mechanics', 'force_type'.
 'experience_level', 'overview_title', 'overview_text', 'instruction_title', 'instruction_text', 'tips_title',
 'tips_text', 'created_by_id', 'create_dte', 'last_update', 'last_update_by'];


 SELECT wd.id AS id, wd.title, wd.sub_title AS subTitle, wd.media_link AS mediaLink, wd.internal_link AS internalLInk,
 wd.trainer_credit_text AS trainerCreditText,
 wd.owner_link AS ownerLink, u.name AS creatorName, mg.name AS muscleGroup, wd.equipment_type AS equipmentType, wd.create_dte AS createdOn
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTable} from '@angular/material/table';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../provider/authentication.service';
import {WorkoutService} from '../workout.service';
import {WorkoutModel} from '../../../models/workout.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
    selector: 'ngx-workouts-list',
    templateUrl: './list-workout.component.html',
    styleUrls: ['./list-workout.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class ListWorkoutComponent implements OnInit {
    dataSource: any;
    matTableData: any;
    previewUrl: string = 'assets/images/no-image-300x300.png';
    columnsToDisplay = ['id', 'imageLink', 'title', 'subTitle', 'creatorName', 'createdOn', 'actions'];
    expandedElement: WorkoutModel | null;
    @ViewChild(MatTable, {static: true}) table: MatTable<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private ts: WorkoutService,
                private router: Router,
                private auth: AuthenticationService) {
        // projectId = 0 for fetching full list
        ts.fetch(0)
            .subscribe((data) => {
                if (parseInt(data.status, 10) === 200) {
                    const temp: WorkoutModel[] = data.data;
                    this.dataSource = data.data;
                    this.matTableData = new MatTableDataSource(temp);
                    this.matTableData.paginator = this.paginator;
                } else if (parseInt(data.status, 10) === 401) {
                    // need to call logout...
                    this.auth.logout();
                    this.router.navigateByUrl('/login');
                } else {
                    alert('There was a general error retrieving the data');
                }
            });
    }

    ngOnInit(): void {
        // nothin for now
    }
    /**
     * @desc Apply filter to list table
     * @param event
     */
    applyFilter(event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.matTableData.filter = filterValue.trim().toLowerCase();
    }
    /**
     * @desc Confirm delete of list table
     * @param id
     */
    onDeleteConfirm(id: number): void {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            this.ts.remove(id)
                .subscribe((res) => {
                    if (parseInt(res.status, 10) === 200) {
                        const index = this.dataSource.findIndex(d => parseInt(d.id, 10) === id);
                        this.dataSource.splice(index, 1);
                        const temp: WorkoutModel[] = this.dataSource;
                        this.matTableData = new MatTableDataSource(temp);
                        this.table.renderRows();
                    } else if (res.status === 401) {
                        // need to call logout...
                        this.auth.logout();
                        this.router.navigateByUrl('/login');
                    } else {
                        alert('There was an issue removing this task');
                    }
                });
        } else {
            // event.confirm.reject();
        }
    }
}
