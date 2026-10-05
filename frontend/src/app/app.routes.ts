import { Routes } from '@angular/router';
import { MainLayoutComponent } from './features/auth/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterTenantComponent } from './features/auth/register-tenant/register-tenant.component';
import { AppLayoutComponent } from './core/layout/app-layout/layout.component';
import { loginRedirectGuard } from './core/guards/login-redirect.guard';
import { provideUsersFeature } from './features/users/users.providers';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [loginRedirectGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterTenantComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      {
        path: 'users',
        loadChildren: () => import('./features/users/feature').then((m) => m.usersRoutes),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
