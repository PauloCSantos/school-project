import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressFormControls } from '../../util/forms/user-form.types';

@Component({
  selector: 'app-address-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-field.component.html',
  styleUrls: ['./address-field.component.scss'],
})
export class AddressFieldComponent {
  @Input({ required: true }) group!: FormGroup<AddressFormControls>;
}
