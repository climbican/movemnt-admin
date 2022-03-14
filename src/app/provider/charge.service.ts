import { Injectable} from '@angular/core';
import { HttpHeaders, HttpClient} from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError} from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {Meta} from '@angular/platform-browser';

@Injectable()
export class ChargeService {
     constructor(private http: HttpClient, private meta: Meta) {}

    /**
     * @param card
     * @param formData
     */
    chargeWithNewCard(card, formData, clientId: number, token: string): Observable<any> {
        const data = JSON.stringify({cardData: card, formParams: formData, clientId: clientId});
        const csfr = this.meta.getTag('name=csrf-token');
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ${token}`}),
        };
        return this.http.post<any>(environment.apiUrl + 'admin/charge/client', data, httpOptions)
            .pipe(
                catchError(_ => of({status: 505, message: 'There was a general error connecting with the server'})),
            );
    }

    /**
     * Charge with existing card
     */
    chargeWithExistingCard(data) {
        // code
    }
}
