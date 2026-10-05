import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenRoles, UsersFacade } from '../../data-access';
import { UsersRegisterComponent } from '../../dialogs/users-register';
import { Role } from '../../../../domain/users/role.type';

type BaseItem = {
  id: string;
  name: string;
  email: string;
};

type ColumnDef = {
  key: string;
  label: string;
  value?: (user: any) => unknown;
};

type TableRoleKey = Exclude<Role, 'master'>;
const COLUMNS_CONFIG: Record<TableRoleKey, ColumnDef[]> = {
  administrator: [
    { key: 'name', label: 'Nome', value: (user) => user?.name?.fullName },
    { key: 'email', label: 'Email' },
    { key: 'graduation', label: 'Graduação' },
  ],
  teacher: [
    { key: 'name', label: 'Nome', value: (user) => user?.name?.fullName },
    { key: 'email', label: 'Email' },
    { key: 'graduation', label: 'Graduação' },
  ],
  student: [
    { key: 'name', label: 'Nome', value: (user) => user?.name?.fullName },
    { key: 'email', label: 'Email' },
  ],
  worker: [
    { key: 'name', label: 'Nome', value: (user) => user?.name?.fullName },
    { key: 'email', label: 'Email' },
  ],
};

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UsersRegisterComponent],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent {
  private facade = inject(UsersFacade);

  loading = signal(false);
  error = signal<string | null>(null);

  role = signal<TableRoleKey>('administrator');
  quantity = signal<number>(20);
  offset = signal<number>(0);

  items = signal<(BaseItem & Record<string, any>)[]>([]);
  total = signal<number | undefined>(undefined);

  registerOpen = signal(false);

  columns = computed<ColumnDef[]>(() => {
    const role = this.role();
    return COLUMNS_CONFIG[role] ?? COLUMNS_CONFIG['administrator'];
  });

  ngOnInit() {
    this.load();
  }

  onRoleChange(ev: Event) {
    const select = ev.target as HTMLSelectElement;
    this.role.set(select.value as TableRoleKey);
    this.offset.set(0);
    this.load();
  }

  openRegister() {
    this.registerOpen.set(true);
  }

  onRegisterOpenChange(open: boolean) {
    this.registerOpen.set(open);
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

  onUpdate(id: string) {
    console.debug('update clicked', id);
  }

  onRemove(id: string) {
    console.debug('remove clicked', id);
  }

  getCellValue(user: any, column: ColumnDef): string {
    let value: unknown;

    if (column.value) {
      value = column.value(user);
    } else {
      value = user?.[column.key];
    }

    if (value == null || value === '') {
      return '—';
    }

    if (column.key === 'salary') {
      return String(value);
    }

    return String(value);
  }
}
