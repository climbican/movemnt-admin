import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class StorageService {
  abstract getItem<T>(key: string): Promise<T>;
  abstract setItem<T>(key: string, value: any): Promise<void>;
  abstract removeItem(key: string): Promise<void>;
}
