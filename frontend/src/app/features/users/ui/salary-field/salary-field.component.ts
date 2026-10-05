import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SalaryFormControls } from '../../util/forms/user-form.types';

@Component({
  selector: 'app-salary-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salary-field.component.html',
  styleUrls: ['./salary-field.component.scss'],
})
export class SalaryFieldComponent {
  @Input({ required: true }) group!: FormGroup<SalaryFormControls>;
  readonly currencies = ['R$', '€', '$'] as const;
}
