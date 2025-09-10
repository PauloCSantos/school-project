import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenRoles, UsersFacade } from '../../data-access';
import { UsersDialogComponent } from '../../dialogs/users-register';

// base comum que esperamos exibir
type BaseItem = {
  id: string;
  name: string;
  email: string;
};

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UsersDialogComponent],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent {
  private facade = inject(UsersFacade);

  loading = signal(false);
  error = signal<string | null>(null);

  // default = 'administrator'
  role = signal<TokenRoles>('administrator');
  quantity = signal<number>(20);
  offset = signal<number>(0);

  // dados
  items = signal<(BaseItem & Record<string, any>)[]>([]);
  total = signal<number | undefined>(undefined);

  // modal cadastro
  registerOpen = signal(false);

  ngOnInit() {
    this.load();
  }

  // trocar o tipo de listagem
  onRoleChange(ev: Event) {
    const select = ev.target as HTMLSelectElement;
    this.role.set(select.value as TokenRoles);
    this.offset.set(0); // reset
    this.load();
  }

  openRegister() {
    this.registerOpen.set(true);
  }
  onRegisterOpenChange(open: boolean) {
    this.registerOpen.set(open);
    // se quiser recarregar ao fechar após criar, habilite:
    // if (!open) this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.facade
      .list(this.role(), {
        quantity: this.quantity(),
        offset: this.offset(),
      })
      .subscribe({
        next: (res: any) => {
          const nextItems = Array.isArray(res) ? res : res?.items ?? [];
          this.items.set(nextItems as any[]);
          this.total.set(Array.isArray(res) ? undefined : res?.total);
          this.loading.set(false);
        },
        error: (err) => {
          const msg = err?.error?.message || err?.message || 'Erro ao carregar usuários';
          this.error.set(msg);
          this.loading.set(false);
        },
      });
  }

  // stubs – ainda sem ação
  onUpdate(id: string) {
    console.debug('update clicked', id);
  }
  onRemove(id: string) {
    console.debug('remove clicked', id);
  }

  // helpers para header/célula específicas do tipo
  specificHeader(): string {
    switch (this.role()) {
      case 'administrator':
        return 'Graduação';
      case 'teacher':
        return 'Disciplina';
      case 'student':
        return 'Série';
      case 'worker':
        return 'Salário';
      default:
        return '';
    }
  }

  specificValue(u: any): string {
    switch (this.role()) {
      case 'administrator':
        return u?.graduation ?? '—';
      case 'teacher':
        return u?.subject ?? '—';
      case 'student':
        return u?.grade ?? '—';
      case 'worker':
        return u?.salary != null ? String(u.salary) : '—';
      default:
        return '—';
    }
  }
}
