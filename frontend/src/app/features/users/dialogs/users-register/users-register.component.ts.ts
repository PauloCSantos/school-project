import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleKey } from '../../config/roles';
import { UserWizardComponent } from '../wizard/user-wizard.component';

@Component({
  selector: 'app-users-register',
  standalone: true,
  imports: [CommonModule, UserWizardComponent],
  templateUrl: './users-register.component.html',
  styleUrls: ['./users-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersRegisterComponent implements OnChanges {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @Input() defaultRole: RoleKey = 'administrator';

  selectedRole = signal<RoleKey>(this.defaultRole);
  mode: 'create' | 'edit' = 'create';
  initialValue: any = null;
  id?: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultRole'] && changes['defaultRole'].currentValue) {
      this.selectedRole.set(changes['defaultRole'].currentValue as RoleKey);
    }
  }

  onRoleChange(ev: Event) {
    const sel = ev.target as HTMLSelectElement;
    this.selectedRole.set(sel.value as RoleKey);
  }

  onWizardClosed = (_success: boolean) => {
    this.close();
  };

  close() {
    this.openChange.emit(false);
  }

  onBackdropClick(ev: MouseEvent) {
    if ((ev.target as HTMLElement).classList.contains('backdrop')) {
      this.close();
    }
  }
}
