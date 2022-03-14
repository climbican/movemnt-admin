/**
 * Name: Workout services
 *
 * Description: THIS WILL PROCESS TRANSACTIONS THAT COME IN FROM THE WEB SITE.
 * !!IMPORTANT NOTE: EACH FUNCTION WILL NEED TO AGGREGATE TO THE RESPECTIVE GATEWAY.
 *
 *
 * Copyright (c) 2019. All Code is the property of FitnessFeed unless unless otherwise specified by contract.
 *
 *          (\ /)
 *          (O .o)
 *          (> "<)
 *          (_/\_)
 *      ]) o 0 []v[]
 *
 *
 *
 * @author Michael Rumack
 * @company FitnessFeed
 * User: climbican
 * Date: 2/5/16
 * Time: 2:35 PM
 * Last Mod:
 * Notes:
 */
import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable()
export class WorkoutService {
  private generalError = {status: 505, message: 'There was a general error connecting with the server'};
  constructor(private http: HttpClient) {}
  /**
   * @param card
   * @param formData
   */
  fetch(workoutId): Observable<any> {
    let fullUrl = environment.apiUrl + 'admin/workouts';
    if (workoutId !== 0) {
      fullUrl = environment.apiUrl + 'admin/workout/detail/' + workoutId;
    }
    return this.http.get<any>(fullUrl)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }
  /**
   * NTOES will need to contain search params
   */
  selectListWorkouts(searchParam) {
    // use searchParam later....
    return this.http.get<any>(environment.apiUrl + 'admin/workouts/list/' + searchParam)
        .pipe(
            catchError(_ => of(this.generalError)),
        );
  }
  /**
   * Charge with existing card
   */
  add(fd) {
    const data = JSON.stringify(fd);

    return this.http.post<any>(environment.apiUrl + 'admin/workouts/add', data)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }

  /**
   *
   * @param data
   */
  update(fd) {
    const data = JSON.stringify(fd);
    return this.http.put<any>(environment.apiUrl + 'admin/workouts/update', data)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }

  /**
   *
   * @param data
   */
  remove(id: number) {
    return this.http.delete<any>(environment.apiUrl + 'admin/workouts/remove/' + id)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }
}
