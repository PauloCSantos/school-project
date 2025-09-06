import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterTenantComponent } from './features/auth/register-tenant/register-tenant.component';
import { AppLayoutComponent } from './layout/app-layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterTenantComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: AppLayoutComponent,
    // canActivate: [authGuard], // quando implementar
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      // Rota Users (pode ser lazy quando existir o módulo/página)
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users.component').then((m) => m.UsersComponent),
      },
      // outras futuras: dashboard, settings, etc.
    ],
  },
  { path: '**', redirectTo: 'login' },
];
