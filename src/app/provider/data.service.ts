/**
 * Name: Data Service
 *
 * Description:
 *
 *
 * Copyright (c) 2019. All Code is the property of Ledgedog unless unless otherwise specified by contract.
 *
 *          (\ /)
 *          (O .o)
 *          (> '<)
 *          (_/\_)
 *      ]) o 0 []v[]
 *
 * @author Michael Rumack
 * @company Ledgedog
 * User: climbican
 * Date: 2/5/16
 * Time: 2:35 PM
 * Last Mod:
 * Notes:
 * NEED TO INCORPORATE STORAGE FOR LONG TERM DATA PERSSTANCE
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {

  private dataSource = new BehaviorSubject({paramName: null, paramValue: null});
  currentData = this.dataSource.asObservable();

  constructor() { }

  updateData(data: any) {
    this.dataSource.next(data);
  }

  fetchByParamName(key) {
    // need to do
  }

  removeDataByKey(key) {
    // need to figure this part out
  }

  addNewValueSet(data) {
    // just expanding the functions
  }

  clearAllData() {
    // clear out all data so I don't make a mess
  }
}
