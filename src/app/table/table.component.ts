import {
  Component,
  AfterViewInit,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogComponent } from '../dialog/dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { User } from '../types/user';
import { Column } from '../types/column';
import { DialogData } from '../types/dialog-data';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  users: User[] = [];
  displayedColumns: string[] = [
    'select',
    'name',
    'surname',
    'email',
    'phone',
    'empty',
  ];
  dataSource = new MatTableDataSource(this.users);
  selection = new SelectionModel<User>(true, []);

  columns: Column[] = [
    { code: 'name', name: 'Имя' },
    { code: 'surname', name: 'Фамилия' },
    { code: 'email', name: 'E-mail' },
    { code: 'phone', name: 'Телефон' },
  ];

  constructor(public dialog: MatDialog, private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.dataSource.data = this.users;
      },
      error: (err: any) => console.log(err),
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  addClient(): void {
    let dialogData: DialogData = {
      title: 'Новый клиент',
      onSaveClick: (data: User) => {
        this.users.push(data);
        this.dataSource.data = this.users;
        this.dataService.setUsers(this.users);
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
        this.dataSource.data = this.users;
        this.dataService.setUsers(this.users);
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
        this.dataSource.data = this.users;
        this.dataService.setUsers(this.users);
      },
    };

    this.dialog.open(DeleteDialogComponent, {
      width: '448px',
      height: '300px',
      panelClass: 'dialog-cont',
      data: dialogData,
    });
  }

  checkAnySelectedRows(): boolean {
    return this.selection.selected.length > 0;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
