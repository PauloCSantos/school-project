import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../types/nav.type';
import { RegisterModalComponent } from '../../../features/auth/register/register-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, RegisterModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  registerModalOpen = signal(false);

  nav: NavItem[] = [
    { label: 'Users', path: '/users' },
    { label: 'Usuários login', path: '#', action: 'openRegisterUser' as const },
  ];

  onNavClick(item: NavItem, event: Event) {
    if ((item as any).action === 'openRegisterUser') {
      event.preventDefault();
      this.registerModalOpen.set(true);
    }
  }
}
