import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-salary-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salary-field.component.html',
  styleUrls: ['./salary-field.component.css']
})
export class SalaryFieldComponent {
  @Input({ required: true }) group!: FormGroup;
  readonly currencies = ['R$', '€', '$'] as const;
}
