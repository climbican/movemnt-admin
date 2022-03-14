import {Inject, Injectable} from '@angular/core';
import {of as observableOf, Observable} from 'rxjs';

@Injectable()
export class StaticSelect {
    exerciseType = [
        {
            id: 1,
            reference: 'strength',
            name: 'Strength',
        },
        {
            id: 2,
            reference: 'cardio',
            name: 'Cardio',
        },
        {
            id: 3,
            reference: 'endurance',
            name: 'Endurance',
        },
        {
            id: 4,
            reference: 'flexibility',
            name: 'Flexibility',
        },
        {
            id: 5,
            reference: 'balance',
            name: 'Balance',
        },
    ];

    getExerciseTypes(): Observable<any[]> {
        return observableOf(this.exerciseType);
    }
}
