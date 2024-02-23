import { DataSource } from '@angular/cdk/collections';
import { ReplaySubject, Observable } from 'rxjs';
import { User } from '../types/user';

export class TableDataSource extends DataSource<any> {
  private _dataStream = new ReplaySubject<any[]>();

  constructor(initialData: any[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<any[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: User[]): void {
    this._dataStream.next(data);
  }
}
