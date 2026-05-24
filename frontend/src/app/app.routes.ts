import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { MainLayout } from './shared/components/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { CompanyList } from './features/companies/pages/company-list/company-list';
import { CompanyForm } from './features/companies/pages/company-form/company-form';
import { UserList } from './features/users/pages/user-list/user-list';
import { UserForm } from './features/users/pages/user-form/user-form';
import { MachineList } from './features/machines/pages/machine-list/machine-list';
import { MachineForm } from './features/machines/pages/machine-form/machine-form';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'companies',
        component: CompanyList,
      },
      {
        path: 'companies/new',
        component: CompanyForm,
      },
      {
        path: 'companies/:id/edit',
        component: CompanyForm,
      },
      {
        path: 'users',
        component: UserList,
      },
      {
        path: 'users/new',
        component: UserForm,
      },
      {
        path: 'users/:id/edit',
        component: UserForm,
      },
      {
        path: 'machines',
        component: MachineList,
      },
      {
        path: 'machines/new',
        component: MachineForm,
      },
      {
        path: 'machines/:id/edit',
        component: MachineForm,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
