import * as localforage from 'localforage';
import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';

@Injectable({ providedIn: 'root' })
export class IndexedDBStorageService implements StorageService {
  private db = localforage.createInstance({
    driver: localforage.INDEXEDDB,
    name: 'movemnt-adm',
    version: 1.0,
    storeName: '_bstore',
  });

  getItem<T>(key: string): Promise<T> {
    return this.db.getItem(key);
  }

  setItem<T>(key: string, value: any): Promise<void> {
    return this.db.setItem(key, value);
  }

  removeItem(key: string): Promise<void> {
    return this.db.removeItem(key);
  }
}
