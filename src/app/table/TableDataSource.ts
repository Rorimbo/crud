import { DataSource } from '@angular/cdk/collections';
import { ReplaySubject, Observable } from 'rxjs';

export class TableDataSource extends DataSource<any> {
  private _dataStream = new ReplaySubject<any[]>();
  data: any;

  constructor(initialData: any[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<any[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: any[]) {
    this._dataStream.next(data);
  }
}
