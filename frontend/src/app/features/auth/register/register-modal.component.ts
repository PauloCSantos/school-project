import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Role } from '../../../core/types/role.type';
import { RegisterService } from './register.service';

type RegisterPayload = {
  email: string;
  password: string;
  role: Exclude<Role, 'master'>;
};

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css'],
})
export class RegisterModalComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() registered = new EventEmitter<void>();

  loading = signal(false);
  apiError = signal<string | null>(null);
  form;

  readonly roles: Exclude<Role, 'master'>[] = ['administrator', 'teacher', 'student', 'worker'];

  constructor(private fb: FormBuilder, private registerService: RegisterService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['administrator', [Validators.required]],
    });
  }

  close() {
    this.openChange.emit(false);
  }

  submit() {
    this.apiError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value as RegisterPayload;
    this.loading.set(true);
    this.registerService.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.registered.emit();
        this.close();
      },
      error: (err) => {
        this.loading.set(false);
        const msg =
          (err?.error && (err.error.message || err.error.error)) ||
          err?.message ||
          'Erro ao registrar usuário';
        this.apiError.set(msg);
      },
    });
  }
}
