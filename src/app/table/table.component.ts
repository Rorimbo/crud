import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogData } from '../dialog/dialog-data';
import { TableDataSource } from './TableDataSource';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges {
  @Input() users: any[] = [];
  displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];

  columns: any[] = [
    { code: 'name', name: 'Имя' },
    { code: 'surname', name: 'Фамилия' },
    { code: 'email', name: 'e-mail' },
    { code: 'phone', name: 'Телефон' },
  ];
  dataSource = new TableDataSource(this.users);

  selection = new SelectionModel<any>(true, []);

  currentElement: any;
  selectedRow: any;

  constructor(public dialog: MatDialog) {}

  addClient() {
    let dialogData: DialogData = {
      title: 'Новый клиент',
      checkSaveButton: null,
      onSaveClick: (data: any) => {
        this.users.push(data);
        this.dataSource.setData(this.users);
      },
      onCancelClick: () => {},
    };

    this.dialog.open(DialogComponent, {
      data: dialogData,
    });
  }

  ngOnChanges() {
    this.dataSource.setData(this.users);
  }

  isAllSelected() {
    const numSelected = this.selection?.selected?.length;
    const numRows = this.users.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.users);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
}
