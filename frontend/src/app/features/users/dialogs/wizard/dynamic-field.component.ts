import { ChangeDetectionStrategy, Component, Input, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from '../../config/roles';
import { getControlByPath } from './utils/form-utils';

// Ajuste os paths conforme o seu projeto
import { AddressFieldComponent } from '../../ui/address-field/address-field.component';
import { SalaryFieldComponent } from '../../ui/salary-field/salary-field.component';
import { NameFieldComponent } from '../../ui';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddressFieldComponent,
    SalaryFieldComponent,
    NameFieldComponent,
  ],
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFieldComponent {
  form = input.required<FormGroup>();
  field = input.required<FieldConfig>();

  ctrl = computed<FormControl>(() => {
    const form = this.form(); // agora é signal -> reativa
    const field = this.field();
    const c = getControlByPath(form, field.key);
    if (!c) throw new Error(`Form control "${field.key}" não encontrado.`);
    return c as FormControl;
  });

  group = computed<FormGroup>(() => {
    const form = this.form();
    const field = this.field();
    const c = getControlByPath(form, field.key);
    if (!c) throw new Error(`Form group "${field.key}" não encontrado.`);
    if (!(c instanceof FormGroup)) throw new Error(`"${field.key}" não é um FormGroup.`);
    return c as FormGroup;
  });
}
