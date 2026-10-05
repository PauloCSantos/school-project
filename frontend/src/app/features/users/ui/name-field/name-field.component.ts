import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NameFormControls } from '../../util/forms/user-form.types';

@Component({
  selector: 'app-name-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './name-field.component.html',
  styleUrls: ['./name-field.component.scss'],
})
export class NameFieldComponent {
  @Input({ required: true }) group!: FormGroup<NameFormControls>;
}
