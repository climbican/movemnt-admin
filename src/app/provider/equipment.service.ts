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
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable()
export class EquipmentService {
  private generalError = {status: 505, message: 'There was a general error connecting with the server'};
  constructor(private http: HttpClient) {}
  /**
   * @param card
   * @param formData
   */
  fetch(clientId: number): Observable<any> {

    let fullUrl = environment.apiUrl + 'admin/equipment/list';
    if (clientId !== 0) {
      fullUrl = fullUrl + clientId;
    }
    return this.http.get<any>(fullUrl)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }

  /**
   * Charge with existing card
   */
  add(fd) {
    const data = JSON.stringify(fd);
    return this.http.post<any>(environment.apiUrl + 'admin/equipment/add', data)
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

    return this.http.put<any>(environment.apiUrl + 'admin/equipment/update', data)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }

  /**
   *
   * @param data
   */
  remove(id: number) {
    const data = JSON.stringify({id: id});

    return this.http.post<any>(environment.apiUrl + 'admin/equipment/remove', data)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }
}
