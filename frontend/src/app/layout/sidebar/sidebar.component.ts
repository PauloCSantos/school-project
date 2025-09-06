import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../core/types/nav.type';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  nav: NavItem[] = [{ label: 'Users', path: '/users' }];
}
