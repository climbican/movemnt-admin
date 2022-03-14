import {Component, OnInit} from '@angular/core';
import {CrudService} from '../../provider/crud.service';
import {catchError, finalize, first, map, timeout} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';

@Component({
    selector: 'ngx-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    routines: any;
    workouts: any;
    members: any;
    activeMembers: any;

    constructor(private crud: CrudService) {
        this.routines = 0;
        this.workouts = 0;
        this.members = 0;
        this.activeMembers = 0;

        forkJoin({
            w: this.crud.fetch(0, 'dashboard', 'workouts'),
            r: this.crud.fetch(0, 'dashboard', 'routines'),
        })
            .pipe(
                timeout(6000),
                map((combined) => {
                    this.routines = combined.r.data;
                    this.workouts = combined.w.data;
                }),
                catchError(error => {
                    return of({results: null});
                }),
            )
            .subscribe();
    }

    ngOnInit() {
    }
}
