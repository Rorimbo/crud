import { Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

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
  dataSource: any;
  selection = new SelectionModel<any>(true, []);

  form: FormGroup;
  currentElement: any;
  selectedRow: any;

  constructor(public dialog: MatDialog) {
    this.form = new FormGroup({});
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource<any>(this.users);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
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
