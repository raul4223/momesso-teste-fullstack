import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { UserService } from '../../../../core/services/user';
import { CompanyService } from '../../../../core/services/company';
import { Company } from '../../../../core/models/company.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  userId: string | null = null;

  companies: Company[] = [];

  formData = {
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'ADMIN' | 'USER',
    companyId: '',
  };

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    this.loadCompanies();

    if (this.userId) {
      this.loadUser(this.userId);
    }
  }

  get isEditMode(): boolean {
    return !!this.userId;
  }

  /*
    Carrega empresas para preencher o select.
    Todo usuário precisa pertencer a uma empresa.
  */
  loadCompanies(): void {
    this.companyService.findAll().subscribe({
      next: (companies) => {
        this.companies = companies;

        /*
          Se estiver criando usuário e ainda não tiver companyId,
          seleciona a primeira empresa automaticamente.
        */
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

  /*
    Carrega os dados do usuário quando estamos em modo edição.
  */
  loadUser(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService
      .findOne(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: (user) => {
          this.formData = {
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            companyId: user.companyId,
          };
        },
        error: (error) => {
          console.error('Erro ao carregar usuário:', error);
          this.errorMessage = 'Não foi possível carregar o usuário.';
        },
      });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isSaving = true;

    if (this.isEditMode && this.userId) {
      this.updateUser(this.userId);
      return;
    }

    this.createUser();
  }

  createUser(): void {
    this.userService
      .create(this.formData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Erro ao criar usuário:', error);
          this.errorMessage = 'Não foi possível criar o usuário.';
        },
      });
  }

  updateUser(id: string): void {
    /*
      Na edição, se a senha estiver vazia, não enviamos password.
      Assim o backend mantém a senha atual.
    */
    const dataToUpdate = {
      name: this.formData.name,
      email: this.formData.email,
      role: this.formData.role,
      companyId: this.formData.companyId,
      ...(this.formData.password ? { password: this.formData.password } : {}),
    };

    this.userService
      .update(id, dataToUpdate)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Erro ao atualizar usuário:', error);
          this.errorMessage = 'Não foi possível atualizar o usuário.';
        },
      });
  }
}
