import { Routes } from '@angular/router';
import { provideUsersFeature } from '../users.providers';

export const usersRoutes: Routes = [
  {
    path: '',
    providers: [provideUsersFeature()],
    loadComponent: () =>
      import('../pages/users-list/users-list.component').then((m) => m.UsersListComponent),
    // canActivate/canMatch podem entrar aqui (item #4 do seu relatório)
  },
];
