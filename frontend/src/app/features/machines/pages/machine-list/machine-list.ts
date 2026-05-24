import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MachineService } from '../../../../core/services/machine';
import { Machine } from '../../../../core/models/machine.model';
import { AuthService } from '../../../../core/services/auth';
import { AuthUser } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-machine-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './machine-list.html',
  styleUrl: './machine-list.scss',
})
export class MachineList implements OnInit {
  machines: Machine[] = [];
  currentUser: AuthUser | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly machineService: MachineService,
    private readonly authService: AuthService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadMachines();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  loadMachines(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.machineService
      .findAll()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: (machines) => {
          this.machines = machines;
        },
        error: (error) => {
          console.error('Erro ao carregar máquinas:', error);
          this.errorMessage = 'Não foi possível carregar as máquinas.';
        },
      });
  }

  deleteMachine(id: string): void {
    const confirmDelete = confirm('Tem certeza que deseja excluir esta máquina?');

    if (!confirmDelete) {
      return;
    }

    this.machineService
      .remove(id)
      .pipe(
        finalize(() => {
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.loadMachines();
        },
        error: (error) => {
          console.error('Erro ao excluir máquina:', error);
          this.errorMessage = 'Não foi possível excluir a máquina.';
        },
      });
  }
}
