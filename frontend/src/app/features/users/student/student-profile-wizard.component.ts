import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseProfileFormComponent } from '../shared/base-profile-form/base-profile-form.component';
import { StudentProfileService } from './student-profile.service';
import { StudentProfile } from '../../../core/types/profile.type';
import { StudentProfileRequest } from './student-profile.request';

@Component({
  selector: 'app-student-profile-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseProfileFormComponent],
  templateUrl: './student-profile-wizard.component.html',
  styleUrls: ['./student-profile-wizard.component.css'],
})
export class StudentProfileWizardComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(StudentProfileService);

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
    paymentYear: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
  });

  submit() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value as StudentProfileRequest;
    this.loading.set(true);
    this.service.create(value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message || err?.message || 'Erro ao salvar';
        this.error.set(msg);
      },
    });
  }
}
