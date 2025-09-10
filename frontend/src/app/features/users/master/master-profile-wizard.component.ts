import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { cnpjValidator } from '../../../core/validators/profile.validator';
import { MasterProfileRequest } from './master-profile.request';
import { BaseProfileFormComponent } from '../ui/profile-form-base/base-profile-form.component';
import { MasterProfileService } from '../data-access/services/master-profile.service';

@Component({
  selector: 'app-master-profile-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseProfileFormComponent],
  templateUrl: './master-profile-wizard.component.html',
  styleUrls: ['./master-profile-wizard.component.css'],
})
export class MasterProfileWizardComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(MasterProfileService);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    name: this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
    }),
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      number: [0, [Validators.required, Validators.min(1)]],
      avenue: ['', Validators.required],
      state: ['', Validators.required],
    }),
    email: ['', [Validators.required, Validators.email]],
    birthday: ['', Validators.required],
    cnpj: ['', [Validators.required, cnpjValidator]],
  });

  submit() {
    console.log('Saved');
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value as MasterProfileRequest;
    this.loading.set(true);
    this.service.create(value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/master']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || err?.message || 'Erro ao salvar';
        this.error.set(msg);
      },
    });
  }
}
