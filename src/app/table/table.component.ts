import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogComponent } from '../dialog/dialog.component';
import { TableDataSource } from './TableDataSource';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ApiService } from '../api.service';
import { User } from '../types/user';
import { Column } from '../types/column';
import { DialogData } from '../types/dialog-data';

/*
TODO: Фильтрация и сортировка данных.
Добавьте возможность фильтровать/сортировать записи по имени / почте / телефону по алфавиту.
TODO: Локальное хранилище.
Сделайте так, чтобы данные таблицы сохранялись в локальном хранилище браузера, чтобы они не исчезали при перезагрузке страницы.
*/

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];

  columns: Column[] = [
    { code: 'name', name: 'Имя' },
    { code: 'surname', name: 'Фамилия' },
    { code: 'email', name: 'E-mail' },
    { code: 'phone', name: 'Телефон' },
  ];
  dataSource = new TableDataSource(this.users);

  selection = new SelectionModel<User>(true, []);

  constructor(public dialog: MatDialog, private api: ApiService) {}

  ngOnInit() {
    this.api.getUsers().subscribe({
      next: (users) => {
        this.users = users.users;
        this.dataSource.setData(this.users);
      },
      error: (err: any) => console.log(err),
    });
  }

  addClient(): void {
    let dialogData: DialogData = {
      title: 'Новый клиент',
      onSaveClick: (data: User) => {
        this.users.push(data);
        this.dataSource.setData(this.users);
      },
    };

    this.dialog.open(DialogComponent, {
      width: '448px',
      height: '593px',
      panelClass: 'dialog-cont',
      data: dialogData,
    });
  }

  editClient(rowIndex: number): void {
    let dialogData: DialogData = {
      title: 'Редактирование',
      clientData: this.users[rowIndex],
      onSaveClick: (data: User) => {
        this.users[rowIndex] = data;
        this.dataSource.setData(this.users);
      },
    };

    this.dialog.open(DialogComponent, {
      width: '448px',
      height: '593px',
      panelClass: 'dialog-cont',
      data: dialogData,
    });
  }

  deleteClient(): void {
    let title = `Удалить выбранные строки (${this.selection?.selected?.length})?`;
    let dialogData: DialogData = {
      title: title,
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
      height: '300px',
      panelClass: 'dialog-cont',
      data: dialogData,
    });
  }

  checkDeleting(): boolean {
    return this.selection.selected.length == 0;
  }

  isAllSelected(): boolean {
    const numSelected = this.selection?.selected?.length;
    const numRows = this.users.length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
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
