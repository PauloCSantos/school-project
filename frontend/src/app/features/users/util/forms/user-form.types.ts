import { FormControl, FormGroup } from '@angular/forms';

export type NameFormControls = {
  firstName: FormControl<string | null>;
  middleName: FormControl<string | null>;
  lastName: FormControl<string | null>;
};

export type NameFormGroup = FormGroup<NameFormControls>;

export type AddressFormControls = {
  street: FormControl<string | null>;
  avenue: FormControl<string | null>;
  number: FormControl<number | null>;
  city: FormControl<string | null>;
  state: FormControl<string | null>;
  zip: FormControl<string | null>;
};

export type AddressFormGroup = FormGroup<AddressFormControls>;

export type SalaryCurrency = 'R$' | '€' | '$';

export type SalaryFormControls = {
  salary: FormControl<number | null>;
  currency: FormControl<SalaryCurrency | null>;
};

export type SalaryFormGroup = FormGroup<SalaryFormControls>;
