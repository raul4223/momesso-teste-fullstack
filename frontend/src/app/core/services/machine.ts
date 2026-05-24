import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Machine,
  CreateMachineRequest,
  UpdateMachineRequest,
} from '../models/machine.model';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  private readonly apiUrl = `${environment.apiUrl}/machines`;

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateMachineRequest): Observable<Machine> {
    return this.http.post<Machine>(this.apiUrl, data);
  }

  update(id: string, data: UpdateMachineRequest): Observable<Machine> {
    return this.http.patch<Machine>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
