import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {of} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Token } from '../models/token';
import { environment as config} from '../../environments/environment';
import {IndexedDBStorageService} from './index-db-storage.service';
import {DataService} from './data.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentToken: any;
    private timeStamp: number;

    constructor(private http: HttpClient,
                private storage: IndexedDBStorageService,
                private dataService: DataService) {
      this.currentToken = new Token();
        storage.getItem('currentToken').then(data => {
            this.currentToken = <Token>data;
        });
      this.timeStamp = new Date().getTime() / 1000;
      // NOTE: MIGHT NEED TO CALL THE getTokenFromStorage() method here as well
    }
    async fetchToken(): Promise <Token> {
      const tokenToTest = await <Token>this.currentToken;
      if (tokenToTest === null) { //  TODO:  || !this.isValidToken() NEED TO WORK ON THIS PART A BIT..  NOT WORKING...
        return Object.assign(new Token(), {});
      } else {
          return Object.assign(new Token(), tokenToTest);
      }
    }
    /**
     * Server response
     * {"status":200,"token_data":"116|6hf1nWPY9Os4LnDBJgvHsOU83lAZZCDHE2463Q8w",
     * "profile":{"name":"Mickey Mike","id":1,"typeId":null},"message":"You have logged in successfully"}
     **/
    login(email: string, password: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<any>(`${config.apiUrl}auth/login`, { email, password }, {headers: headers})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token_data) {
                  this.currentToken =  Object.assign(new Token(), {token: user.token_data, token_received: this.timeStamp});
                  this.dataService.updateData({paramName: 'token', paramValue: this.currentToken});
                  this.storage.setItem('currentToken', this.currentToken).then(() => {});
                  this.storage.setItem('userData', user.profile);
                  // format return
                  return {status: 200, success: true, message: 'You have logged in successfully'};
                } else {
                    return {status: 401, success: false, message: 'Incorrect username or password'};
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        // this can be an Observable...
        this.storage.removeItem('currentToken').then((data) => {});
    }
    /*
     * {'data':{
     * 'token_type':'Bearer',
     * 'expires_in':1296000,
     * 'access_token':
     * token_received
     * token_origin
     */
    isValidToken(): Promise<any> {
        try {
            this.storage.getItem('currentToken')
              .then( (data) => {
                  if (data === null || data === 'undefined') {
                      return false;
                  } else {
                      // this is where I left off on validation
                      const tokenData = this.currentToken;
                    /**
                     Error: Uncaught (in promise): TypeError: Cannot read property 'token_received' of undefined
                     TypeError: Cannot read property 'token_received' of undefined
                     */
                    const expiresOn = parseInt(tokenData.token_received + tokenData.expires_in, 0);
                      const sixtyDaysFromStart = parseInt(tokenData.token_origin + (60 * 60 * 24 * 60), 0);
                      // test how to proceed
                      if ( expiresOn > this.timeStamp) {
                          return true;
                      } else {
                          // Check if the token is invalid but still eligible for a token refresh
                          if ( expiresOn < this.timeStamp && this.timeStamp < sixtyDaysFromStart) {
                              // refresh token, need to figure this one out
                              return true;
                          } else {
                              return false;
                          }
                      }
                  }
                },
                    error => {
                        return new Promise<any>(resolve => resolve({}));
                    });
        } catch (e) {
            return new Promise<any>(resolve => resolve({}));
        }
    }
    /*
   * @desc refresh token
   */
    refreshToken() {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<any>(`${config.apiUrl}token/refresh`, {refreshToken: this.currentToken.refresh_token}, {headers})
            .pipe(map( (data) => {
                    // need to test this
                    this.currentToken = Object.assign({},
                                                      this.currentToken,
                                              {token_received: this.timeStamp, token_origin: this.timeStamp});
                    // this.storage.setItem('currentToken', this.currentToken).then(() => {});
                    return {status: 200, success: true, message: 'You have refreshed your token'};
                },
                catchError(err => of([{status: 401, success: false, message: 'There was an issue with the server refreshing the tokeb.'}])),
            ));
    }
}
