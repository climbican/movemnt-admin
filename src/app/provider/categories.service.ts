import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {environment as env} from '../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map, timeout} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private generalError = {status: 505, message: 'There was a general error connecting with the server'};
  constructor(private http: HttpClient) { }
  // type = workout / routine
  getWorkoutTypeCategories(type): Observable<any>{
    return this.http.get(env.apiUrl + 'categories/' + type)
        .pipe(timeout(6000),
              map( (data) => {
              return data;
            },
            catchError(err => of([{status: 419, success: false, message: 'There was an issue with the server.'}])),
        ));
  }
}
