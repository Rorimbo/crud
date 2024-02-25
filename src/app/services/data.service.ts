import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map, of } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private api: ApiService) {}

  getUsers(): Observable<User[]> {
    if (localStorage['usersTable']) {
      return of(JSON.parse(localStorage['usersTable']));
    } else {
      return this.api.getUsers().pipe(map((response) => response.users));
    }
  }

  setUsers(users: User[]) {
    localStorage.setItem('usersTable', JSON.stringify(users));
  }
}
