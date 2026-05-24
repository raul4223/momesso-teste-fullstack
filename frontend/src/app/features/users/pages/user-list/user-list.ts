import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { UserService } from '../../../../core/services/user';
import { User } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth';
import { AuthUser } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  users: User[] = [];
  currentUser: AuthUser | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadUsers();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  isCurrentUser(user: User): boolean {
    return user.id === this.currentUser?.id;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService
      .findAll()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: (users) => {
          this.users = this.sortUsersWithCurrentFirst(users);
        },
        error: (error) => {
          console.error('Erro ao carregar usuários:', error);
          this.errorMessage = 'Não foi possível carregar os usuários.';
        },
      });
  }

  deleteUser(id: string): void {
    const confirmDelete = confirm('Tem certeza que deseja excluir este usuário?');

    if (!confirmDelete) {
      return;
    }

    this.userService
      .remove(id)
      .pipe(
        finalize(() => {
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          this.errorMessage = 'Não foi possível excluir o usuário.';
        },
      });
  }

  // Mantém o usuário logado no topo sem alterar a API.
  private sortUsersWithCurrentFirst(users: User[]): User[] {
    return [...users].sort((firstUser, secondUser) => {
      if (firstUser.id === this.currentUser?.id) {
        return -1;
      }

      if (secondUser.id === this.currentUser?.id) {
        return 1;
      }

      return 0;
    });
  }
}
