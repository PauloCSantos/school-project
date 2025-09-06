import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  menuOpen = signal(false);

  constructor(private router: Router, private authService: AuthService) {}

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  // Fecha ao clicar fora
  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (!target.closest('.user-menu')) this.closeMenu();
  }

  // Acessibilidade: tecla Esc fecha
  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeMenu();
  }

  goProfile() {
    this.closeMenu();
    this.router.navigate(['/profile']); // ajuste a rota se necessário
  }

  logout() {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
