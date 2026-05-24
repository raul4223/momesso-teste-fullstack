import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';

import { AuthService } from '../../../../core/services/auth';
import { CompanyService } from '../../../../core/services/company';
import { MachineService } from '../../../../core/services/machine';
import { UserService } from '../../../../core/services/user';
import { AuthUser } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  user: AuthUser | null = null;

  totalCompanies = 0;
  totalUsers = 0;
  totalMachines = 0;

  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly machineService: MachineService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadDashboardData();
  }

  // Carrega os totais principais do painel administrativo.
  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      companies: this.companyService.findAll(),
      users: this.userService.findAll(),
      machines: this.machineService.findAll(),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: ({ companies, users, machines }) => {
          this.totalCompanies = companies.length;
          this.totalUsers = users.length;
          this.totalMachines = machines.length;
        },
        error: (error) => {
          console.error('Erro ao carregar dados do dashboard:', error);
          this.errorMessage = 'Não foi possível carregar os dados do dashboard.';
        },
      });
  }
}
