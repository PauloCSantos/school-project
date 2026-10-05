import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnChanges,
  SimpleChanges,
  computed,
  inject,
  signal,
  effect,
  untracked,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig, RoleWizardConfig } from '../../feature/wizard/core/types';
import { ROLE_WIZARD_REGISTRY } from '../../feature/wizard/core/tokens';
import { buildForm, getControlByPath } from './utils/form-utils';
import { DynamicFieldComponent } from './dynamic-field.component';
import { Role } from '../../../../domain/users/role.type';

@Component({
  selector: 'app-user-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFieldComponent],
  templateUrl: './user-wizard.component.html',
  styleUrls: ['./user-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserWizardComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private injector = inject(Injector);
  private configs = inject(ROLE_WIZARD_REGISTRY, { optional: true }) ?? [];

  private registry = inject(ROLE_WIZARD_REGISTRY, { optional: true });
  private _role!: Role;
  @Input({ required: true }) set role(v: Role) {
    this._role = v;
    this.roleSig.set(v);
  }
  get role(): Role {
    return this._role;
  }

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() creationMode: 'full' | 'partial' = 'full';
  @Input() initialValue: any = null;
  @Input() id?: string;

  @Output() closed = new EventEmitter<boolean>();

  roleSig = signal<Role | null>(null);
  prevRole = signal<Role | null>(null);
  cfg = computed<RoleWizardConfig | undefined>(() => {
    const role = this.roleSig();
    if (!role || !this.registry) return undefined;
    return this.registry[role];
  });

  form = signal<FormGroup | null>(null);
  stepIndex = signal(0);
  private _tick = signal(0);

  currentStepValid = computed(() => {
    this._tick();
    const form = this.form();
    const cfg = this.cfg();
    const step = this.stepIndex();
    if (!form || !cfg) return false;

    const raw = form.getRawValue();
    const visibleSteps = this.steps;
    if (!visibleSteps.length || step < 0 || step >= visibleSteps.length) return false;

    const stepDef = visibleSteps[step];
    const visible = stepDef.fields
      .map((k: string) => cfg.fields.find((f) => f.key === k)!)
      .filter(Boolean)
      .filter((f: any) => (f.visibleWhen ? !!f.visibleWhen(raw) : true));

    for (const f of visible) {
      const ctrl = getControlByPath(form, f.key);
      if (ctrl?.invalid) return false;
    }
    return true;
  });

  private rebuildEffect = effect(() => {
    const cfg = this.cfg();
    const role = this.roleSig();
    if (!cfg || !role) return;

    const prevForm = untracked(() => this.form());
    const oldRole = untracked(() => this.prevRole());

    const defaults = { ...(cfg.defaults ?? {}), ...(this.initialValue ?? {}) };
    const nextForm = buildForm(this.fb, cfg.fields, defaults);

    if (!prevForm || !oldRole) {
      this.form.set(nextForm);
      this.prevRole.set(role);
    } else {
      const roleMudou = oldRole !== role;
      if (roleMudou) {
        const baseFields = cfg.fields.filter((f) => f.preserveOnRoleChange);
        this.copyCompatibleValues(prevForm, nextForm, baseFields);
      } else {
        this.copyCompatibleValues(prevForm, nextForm, cfg.fields);
      }
      this.form.set(nextForm);
      this.prevRole.set(role);
    }

    if (this.creationMode === 'partial') {
      const allowedFields = new Set<string>(this.steps.flatMap((s: any) => s.fields ?? []));
      cfg.fields.forEach((field) => {
        if (!allowedFields.has(field.key)) {
          const ctrl = getControlByPath(nextForm, field.key);
          if (ctrl) {
            ctrl.clearValidators();
            ctrl.setErrors(null);
            ctrl.updateValueAndValidity();
          }
        }
      });
    }

    nextForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });

    const current = untracked(() => this.stepIndex());
    const max = (this.steps.length ?? 0) - 1;
    if (max < 0 || current > max) this.stepIndex.set(0);

    setTimeout(() => this._tick.update((n) => n + 1), 0);
  });

  private formChangesEffect = effect((onCleanup) => {
    const form = this.form();
    if (!form) return;

    const subImmediate = form.valueChanges.subscribe(() => {
      this._tick.update((n) => n + 1);
    });

    const subStatus = form.statusChanges.subscribe(() => {
      this._tick.update((n) => n + 1);
    });

    onCleanup(() => {
      subImmediate.unsubscribe();
      subStatus.unsubscribe();
    });
  });

  ngOnChanges(_: SimpleChanges): void {}

  get step() {
    return this.stepIndex();
  }

  get steps() {
    const cfg = this.cfg();
    if (!cfg) return [];
    const mode = this.creationMode ?? 'full';
    return (cfg.steps ?? []).filter((s) => (s.showOn ? s.showOn.includes(mode) : true));
  }

  visibleFields(step: number): ReadonlyArray<FieldConfig> {
    const cfg = this.cfg()!;
    const form = this.form()!;
    const raw = form.getRawValue();
    const stepDef = this.steps[step];

    return stepDef.fields
      .map((k) => cfg.fields.find((f) => f.key === k)!)
      .filter(Boolean)
      .filter((f) => (f.visibleWhen ? !!f.visibleWhen(raw) : true));
  }

  next() {
    if (!this.canProceedStep(this.stepIndex())) return;
    if (this.step < this.steps.length - 1) this.stepIndex.update((i) => i + 1);
  }

  prev() {
    if (this.step > 0) this.stepIndex.update((i) => i - 1);
  }

  submit() {
    const cfg = this.cfg()!;
    const form = this.form()!;
    const last = (this.steps.length ?? 1) - 1;

    const canProceed = this.canProceedStep(last);
    if (!canProceed) return;

    if (form.invalid) {
      if (this.creationMode === 'partial') {
        // permitir envio parcial
      } else {
        form.markAllAsTouched();
        return;
      }
    }

    const fullPayload = cfg.toRequest(form.getRawValue());
    let payload: any = fullPayload;

    if (this.creationMode === 'partial') {
      const allowedFields = new Set<string>((this.steps ?? []).flatMap((s: any) => s.fields ?? []));
      allowedFields.add('email');
      payload = Object.fromEntries(
        Object.entries(fullPayload).filter(([k]) => allowedFields.has(k))
      );
    }

    const service = this.injector.get(cfg.serviceToken);
    (payload as any).creationMode = this.creationMode;

    const obs =
      this.mode === 'create'
        ? service.create(payload as any)
        : service.update!(this.id!, payload as any);

    obs.subscribe({
      next: () => this.closed.emit(true),
      error: () => this.closed.emit(false),
    });
  }

  @HostListener('focusout', ['$event'])
  onAnyFieldBlur(_ev: FocusEvent) {
    this._tick.update((n) => n + 1);
  }

  private copyCompatibleValues(from: FormGroup, to: FormGroup, fields: ReadonlyArray<FieldConfig>) {
    const src = from.getRawValue();
    for (const f of fields) {
      const path = f.key;
      const prevVal = this.getValueByPath(src, path);
      const ctrl = getControlByPath(to, path) as AbstractControl | null;
      if (prevVal !== undefined) ctrl?.patchValue(prevVal, { emitEvent: false });
    }
  }

  private canProceedStep(stepIdx: number): boolean {
    const form = this.form();
    const cfg = this.cfg();
    if (!form || !cfg) return false;

    const visibleFields = this.visibleFields(stepIdx);
    const keys = visibleFields.map((f) => f.key);
    let ok = true;

    for (const key of keys) {
      const ctrl = getControlByPath(form, key);
      if (!ctrl) continue;
      this.markDeepAsTouched(ctrl);
      ctrl.updateValueAndValidity({ onlySelf: false });
      if (ctrl.invalid) ok = false;
    }
    return ok;
  }

  private markDeepAsTouched(ctrl: AbstractControl | null | undefined) {
    if (!ctrl) return;
    (ctrl as any).markAsTouched?.();
    const asAny = ctrl as any;
    if (asAny.controls) {
      Object.values(asAny.controls).forEach((c: any) => this.markDeepAsTouched(c));
    }
  }

  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);
  }
}
