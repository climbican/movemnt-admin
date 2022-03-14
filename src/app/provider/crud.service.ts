/**
 * Name: Customer services
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
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable()
export class CrudService {
  private apiEndPoints = {
    clients: {list: 'admin/client/list', fetchSingle: 'admin/client/detail/', add: 'admin/client/add', update: 'admin/client/update', remove: 'admin/client/remove'},
    muscleGroup: {list: 'muscle_groups'},
    users: {selectList: 'admin/user/list/select', list: 'admin/user/list', add: 'admin/client/add', update: 'admin/client/update', remove: 'admin/user/remove'},
    equipment: {list: 'admin/equipment', fetchSingle: 'admin/equipment/detail', add: 'admin/equipment/add', update: 'admin/equipment/update', remove: 'admin/equipment/remove'},
    workout: {removeImage: 'admin/remove/workout/image'},
    dashboard: { routines: 'dash/routines', workouts: 'dash/workouts'},
  };
  private generalError = {status: 505, message: 'There was a general error connecting with the server'};
  constructor(private http: HttpClient) {}
  /**
   * @param card
   * @param formData
   */
  fetch(id: number, target, endpointName): Observable<any> {
    let fullUrl = environment.apiUrl + this.apiEndPoints[target][endpointName];
    if (id !== 0) {
      fullUrl = fullUrl + '/' + id;
    }
    return this.http.get<any>(fullUrl)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }

  /**
   * Charge with existing card
   */
  add(fd, target, endpointName): Observable<any> {
    const data = JSON.stringify(fd);

    return this.http.post<any>(environment.apiUrl + this.apiEndPoints[target][endpointName], data)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }

  /**
   *
   * @param data
   */
  update(fd, target, endpointName) {
    const data = JSON.stringify(fd);

    return this.http.put<any>(environment.apiUrl + this.apiEndPoints[target][endpointName], data)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }

  /**
   *
   * @param data
   */
  remove(id: number, target: string, endpointName: string) {
    return this.http.delete<any>(environment.apiUrl + this.apiEndPoints[target][endpointName] + '/' + id)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }
}
