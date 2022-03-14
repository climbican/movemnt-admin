/**
 * Name: User services
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
import {Storage} from '@ionic/storage';

@Injectable()
export class UserService {
    private generalError = {status: 505, message: 'There was a general error connecting with the server'};
    constructor(private http: HttpClient, private storage: Storage) {}
    /**
     * @param card
     * @param formData
     */
    fetch(clientId: number): Observable<any> {
        let fullUrl = environment.apiUrl + 'admin/user/';
        if (clientId !== 0) {
          fullUrl = fullUrl + 'detail/' + clientId;
        }
        else {
            fullUrl = fullUrl + 'list';
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
        return this.http.post<any>(environment.apiUrl + 'admin/user/add', data)
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
        return this.http.put<any>(environment.apiUrl + 'admin/user/update', data)
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
    return this.http.delete<any>(environment.apiUrl + 'admin/user/remove/' + id)
      .pipe(
        catchError(_ => of(this.generalError)),
      );
  }

  fetchStoredProfile(): Promise<any> {
      return this.storage.get('userData')
          .then( data => {
              return data;
          });
  }
}
