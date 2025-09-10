import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressFieldComponent } from '../address-field/address-field.component';

@Component({
  selector: 'app-base-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddressFieldComponent],
  templateUrl: './base-profile-form.component.html',
  styleUrls: ['./base-profile-form.component.css'],
})
export class BaseProfileFormComponent {
  @Input({ required: true }) form!: FormGroup;

  get addressGroup(): FormGroup {
    return this.form.get('address') as FormGroup;
  }
}
