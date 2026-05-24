import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MachineService } from '../../../../core/services/machine';
import { CompanyService } from '../../../../core/services/company';
import { Company } from '../../../../core/models/company.model';

@Component({
  selector: 'app-machine-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './machine-form.html',
  styleUrl: './machine-form.scss',
})
export class MachineForm implements OnInit {
  machineId: string | null = null;

  companies: Company[] = [];

  formData = {
    name: '',
    serialNumber: '',
    companyId: '',
  };

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private readonly machineService: MachineService,
    private readonly companyService: CompanyService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.machineId = this.route.snapshot.paramMap.get('id');

    this.loadCompanies();

    if (this.machineId) {
      this.loadMachine(this.machineId);
    }
  }

  get isEditMode(): boolean {
    return !!this.machineId;
  }

  loadCompanies(): void {
    this.companyService.findAll().subscribe({
      next: (companies) => {
        this.companies = companies;

        if (!this.isEditMode && companies.length > 0 && !this.formData.companyId) {
          this.formData.companyId = companies[0].id;
        }

        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar empresas:', error);
        this.errorMessage = 'Não foi possível carregar as empresas.';
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  loadMachine(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.machineService
      .findOne(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: (machine) => {
          this.formData = {
            name: machine.name,
            serialNumber: machine.serialNumber,
            companyId: machine.companyId,
          };
        },
        error: (error) => {
          console.error('Erro ao carregar máquina:', error);
          this.errorMessage = 'Não foi possível carregar a máquina.';
        },
      });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isSaving = true;

    if (this.isEditMode && this.machineId) {
      this.updateMachine(this.machineId);
      return;
    }

    this.createMachine();
  }

  createMachine(): void {
    this.machineService
      .create(this.formData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/machines']);
        },
        error: (error) => {
          console.error('Erro ao criar máquina:', error);
          this.errorMessage = 'Não foi possível criar a máquina.';
        },
      });
  }

  updateMachine(id: string): void {
    this.machineService
      .update(id, this.formData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/machines']);
        },
        error: (error) => {
          console.error('Erro ao atualizar máquina:', error);
          this.errorMessage = 'Não foi possível atualizar a máquina.';
        },
      });
  }
}
