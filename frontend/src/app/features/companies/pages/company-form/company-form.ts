import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CompanyService } from '../../../../core/services/company';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './company-form.html',
  styleUrl: './company-form.scss',
})
export class CompanyForm implements OnInit {
  companyId: string | null = null;

  formData = {
    name: '',
    cnpj: '',
  };

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private readonly companyService: CompanyService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id');

    if (this.companyId) {
      this.loadCompany(this.companyId);
    }
  }

  get isEditMode(): boolean {
    return !!this.companyId;
  }

  loadCompany(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.companyService
      .findOne(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: (company) => {
          this.formData = {
            name: company.name,
            cnpj: company.cnpj,
          };
        },
        error: () => {
          this.errorMessage = 'Não foi possível carregar a empresa.';
        },
      });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isSaving = true;

    if (this.isEditMode && this.companyId) {
      this.updateCompany(this.companyId);
      return;
    }

    this.createCompany();
  }

  createCompany(): void {
    this.companyService
      .create(this.formData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/companies']);
        },
        error: (error) => {
          console.error('Erro ao criar empresa:', error);
          this.errorMessage = 'Não foi possível criar a empresa.';
        },
      });
  }

  updateCompany(id: string): void {
    this.companyService
      .update(id, this.formData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/companies']);
        },
        error: (error) => {
          console.error('Erro ao atualizar empresa:', error);
          this.errorMessage = 'Não foi possível atualizar a empresa.';
        },
      });
  }
}
