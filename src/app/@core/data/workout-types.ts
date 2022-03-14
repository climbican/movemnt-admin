import {Inject, Injectable} from '@angular/core';
import {of as observableOf, Observable} from 'rxjs';
export class WorkoutTypesModel {
    name: string;
    ref: string;
    groupVisibility: any;
}

@Injectable()
export class WorkoutTypes {
    private workoutNames = <WorkoutTypesModel[]>[
        {
            name: 'Muscle Strength',
            ref: 'str',
            groupVisibility: ['beginner', 'intermediate', 'advanced'],
        },
        {
            name: 'Muscle Endurance',
            ref: 'musc-end',
            groupVisibility: ['beginner', 'intermediate', 'advanced'],
        },
        {
            name: 'Body Building',
            ref: 'bod',
            groupVisibility: ['intermediate', 'advanced'],
        },
        {
            name: 'Olympic Lifting',
            ref: 'oly',
            groupVisibility: ['advanced'],
        },
        {
            name: 'Power Lifting',
            ref: 'pow',
            groupVisibility: ['advanced'],
        },
        {
            name: 'General Fitness',
            ref: 'fit',
            groupVisibility: ['beginner', 'intermediate', 'advanced'],
        },
        {
            name: 'Weight Loss',
            ref: 'loss',
            groupVisibility: ['beginner', 'intermediate', 'advanced'],
        },
        {
            name: 'Cardio Endurance',
            ref: 'end-cardio',
            groupVisibility: ['beginner', 'intermediate', 'advanced'],
        },
        {
            name: 'Plyometrics',
            ref: 'plyo',
            groupVisibility: ['beginner', 'intermediate', 'advanced'],
        },
        {
            name: 'Flexibility',
            ref: 'flex',
            groupVisibility: ['beginner', 'intermediate', 'advanced'],
        },
        {
            name: 'Balance',
            ref: 'bal',
            groupVisibility: ['beginner', 'intermediate', 'advanced'],
        },
        {
            name: 'Self Myofascial Release',
            ref: 'smr',
            groupVisibility: ['beginner', 'intermediate', 'advanced'],
        },
    ];

    getWorkoutNames(): Observable<any[]> {
        return observableOf(this.workoutNames);
    }
}
