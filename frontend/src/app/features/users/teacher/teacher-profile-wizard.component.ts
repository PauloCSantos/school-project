import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseProfileFormComponent } from '../shared/base-profile-form/base-profile-form.component';
import { AddressFieldComponent } from '../shared/address-field/address-field.component';
import { SalaryFieldComponent } from '../shared/salary-field/salary-field.component';
import { TeacherProfileService } from './teacher-profile.service';
import { positiveMoneyValidator } from '../../../core/validators/profile.validator';
import { TeacherProfile } from '../../../core/types/profile.type';
import { TeacherProfileRequest } from './teacher-profile.request';

@Component({
  selector: 'app-teacher-profile-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseProfileFormComponent, SalaryFieldComponent],
  templateUrl: './teacher-profile-wizard.component.html',
  styleUrls: ['./teacher-profile-wizard.component.css'],
})
export class TeacherProfileWizardComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private service = inject(TeacherProfileService);

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
    salary: this.fb.group({
      salary: [0, [Validators.required, positiveMoneyValidator]],
      currency: ['R$'],
    }),
    graduation: ['', Validators.required],
    academicDegrees: ['', Validators.required],
  });

  submit() {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value as TeacherProfileRequest;
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

  get salaryGroup(): FormGroup {
    return this.form.get('salary') as FormGroup;
  }
}
