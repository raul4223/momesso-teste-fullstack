import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CompanyService } from '../../../../core/services/company';
import { Company } from '../../../../core/models/company.model';
import { AuthService } from '../../../../core/services/auth';
import { AuthUser } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './company-list.html',
  styleUrl: './company-list.scss',
})
export class CompanyList implements OnInit {
  companies: Company[] = [];
  currentUser: AuthUser | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly companyService: CompanyService,
    private readonly authService: AuthService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadCompanies();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  loadCompanies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.companyService
      .findAll()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: (companies) => {
          this.companies = companies;
        },
        error: (error) => {
          console.error('Erro ao carregar empresas:', error);
          this.errorMessage = 'Não foi possível carregar as empresas.';
        },
      });
  }

  deleteCompany(id: string): void {
    const confirmDelete = confirm('Tem certeza que deseja excluir esta empresa?');

    if (!confirmDelete) {
      return;
    }

    this.companyService
      .remove(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.loadCompanies();
        },
        error: (error) => {
          console.error('Erro ao excluir empresa:', error);
          this.errorMessage = 'Não foi possível excluir a empresa.';
        },
      });
  }
}
