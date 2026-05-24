import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly apiUrl = `${environment.apiUrl}/companies`;

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateCompanyRequest): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, data);
  }

  update(id: string, data: UpdateCompanyRequest): Observable<Company> {
    return this.http.patch<Company>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
