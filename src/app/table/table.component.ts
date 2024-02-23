import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogData } from '../dialog/dialog-data';
import { TableDataSource } from './TableDataSource';
import { DeleteDialogData } from '../delete-dialog/delete-dialog-data';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  users: any[] = [];
  displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];

  columns: any[] = [
    { code: 'name', name: 'Имя' },
    { code: 'surname', name: 'Фамилия' },
    { code: 'email', name: 'e-mail' },
    { code: 'phone', name: 'Телефон' },
  ];
  dataSource = new TableDataSource(this.users);

  selection = new SelectionModel<any>(true, []);

  constructor(public dialog: MatDialog, private api: ApiService) {}

  ngOnInit() {
    this.api.getUsers().subscribe({
      next: (users: any) => {
        this.users = users.users;
        this.dataSource.setData(this.users);
      },
      error: (err: any) => console.log(err),
    });
  }

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
      width: '448px',
      height: '593px',
      panelClass: 'dialog-cont',
      data: dialogData,
    });
  }

  editClient(rowIndex: any) {
    let dialogData: DialogData = {
      title: 'Редактирование',
      checkSaveButton: null,
      clientData: this.users[rowIndex],
      onSaveClick: (data: any) => {
        this.users[rowIndex] = data;
        this.dataSource.setData(this.users);
      },
      onCancelClick: () => {},
    };

    this.dialog.open(DialogComponent, {
      width: '448px',
      height: '593px',
      panelClass: 'dialog-cont',
      data: dialogData,
    });
  }

  deleteClient() {
    let dialogData: DeleteDialogData = {
      rowCount: this.selection?.selected?.length,
      onSaveClick: () => {
        this.selection?.selected?.forEach((el) => {
          let index = this.users.indexOf(el);
          this.users.splice(index, 1);
        });
        this.selection.clear();
        this.dataSource.setData(this.users);
      },
    };

    this.dialog.open(DeleteDialogComponent, {
      width: '448px',
      height: '593px',
      panelClass: 'dialog-cont',
      data: dialogData,
    });
  }

  checkDeleting() {
    return this.selection.selected.length == 0;
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
