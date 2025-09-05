import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TenantService } from './register-tenant.service';
import { RegisterTenantResponse } from './register-tenant.response';

@Component({
  selector: 'app-register-tenant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-tenant.component.html',
  styleUrls: ['./register-tenant.component.css'],
})
export class RegisterTenantComponent {
  loading = signal(false);
  apiError = signal<string | null>(null);
  apiSuccess = signal<string | null>(null);
  form;

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        // valida 14 dígitos, mesmo com máscara
        cnpj: ['', [Validators.required, cnpjValidator]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [passwordsMatchValidator] }
    );
  }

  submit(): void {
    this.apiError.set(null);
    this.apiSuccess.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, cnpj } = this.form.getRawValue();

    // Envia só números para o backend
    const cnpjDigits = (cnpj || '').replace(/\D/g, '');

    this.loading.set(true);
    this.tenantService
      .registerTenant({
        email: email!,
        password: password!,
        cnpj: cnpjDigits!,
        role: 'master',
      })
      .subscribe({
        next: (res: RegisterTenantResponse) => {
          this.router.navigate(['/login'], {
            state: {
              email: res.email,
              masterId: res.masterId,
            },
          });
        },
        error: (err) => {
          const msg = extractHttpErrorMessage(err) ?? 'Não foi possível registrar o tenant.';
          this.apiError.set(msg);
        },
        complete: () => this.loading.set(false),
      });
  }

  get f() {
    return this.form.controls;
  }

  formatCnpj(e: Event) {
    const el = e.target as HTMLInputElement;
    const digits = (el.value || '').replace(/\D/g, '').slice(0, 14);

    const masked = digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');

    el.value = masked;
    this.form.get('cnpj')!.setValue(masked, { emitEvent: false });
    this.form.get('cnpj')!.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }
}

function cnpjValidator(ctrl: AbstractControl): ValidationErrors | null {
  const value = (ctrl.value ?? '') as string;
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  return digits.length === 14 ? null : { cnpj: true };
}

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordsDontMatch: true };
}

function extractHttpErrorMessage(err: any): string | null {
  if (!err) return null;
  const msg = err?.error?.message || err?.message;
  if (typeof msg === 'string') return msg;
  return null;
}
