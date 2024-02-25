import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(
      'https://test-data.directorix.cloud/task1'
    );
  }
}
