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
import { FieldConfig, RoleKey, RoleWizardConfig } from '../../config/roles';
import { ROLE_WIZARD_REGISTRY } from '../../data-access/tokens/role-wizard-registry.token';
import { buildForm, getControlByPath } from './utils/form-utils';
import { DynamicFieldComponent } from './dynamic-field.component';

@Component({
  selector: 'app-user-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFieldComponent],
  templateUrl: './user-wizard.component.html',
  styleUrls: ['./user-wizard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserWizardComponent implements OnChanges {
  // ===== Inputs =====
  private _role!: RoleKey;
  @Input({ required: true }) set role(v: RoleKey) {
    this._role = v;
    this.roleSig.set(v);
  }

  @Output() closed = new EventEmitter<boolean>();
  get role(): RoleKey {
    return this._role;
  }

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialValue: any = null;
  @Input() id?: string;

  // ===== DI =====
  private fb = inject(FormBuilder);
  private injector = inject(Injector);
  private configs = inject(ROLE_WIZARD_REGISTRY, { optional: true }) ?? [];

  // ===== State (signals) =====
  roleSig = signal<RoleKey | null>(null);
  prevRole = signal<RoleKey | null>(null);

  cfg = computed<RoleWizardConfig | undefined>(() =>
    this.configs.find((c) => c.role === this.roleSig()!)
  );

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
    const stepDef = cfg.steps[step];
    const visible = stepDef.fields
      .map((k: string) => cfg.fields.find((f) => f.key === k)!)
      .filter(Boolean)
      .filter((f: any) => (f.visibleWhen ? !!f.visibleWhen(raw) : true));

    let allValid = true;
    for (const f of visible) {
      const ctrl = getControlByPath(form, f.key);
      if (ctrl?.invalid) {
        allValid = false;
      }
    }

    return allValid;
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

    nextForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });

    const current = untracked(() => this.stepIndex());
    const max = (cfg.steps?.length ?? 0) - 1;
    if (max < 0) {
      this.stepIndex.set(0);
    } else if (current > max) {
      this.stepIndex.set(0);
    }

    this._tick.update((n) => n + 1);
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

  // ===== Lifecycle =====
  ngOnChanges(_: SimpleChanges): void {}

  // ===== API usada no template =====
  get step() {
    return this.stepIndex();
  }
  get steps() {
    return this.cfg()?.steps ?? [];
  }

  visibleFields(step: number): FieldConfig[] {
    const cfg = this.cfg()!;
    const form = this.form()!;
    const raw = form.getRawValue();
    const stepDef = cfg.steps[step];

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
    const last = (this.cfg()?.steps.length ?? 1) - 1;
    if (!this.canProceedStep(last)) return;

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const payload = cfg.toRequest(form.getRawValue());
    const service = this.injector.get(cfg.serviceToken);
    const obs =
      this.mode === 'create' ? service.create(payload) : service.update!(this.id!, payload);

    obs.pipe().subscribe({
      next: () => this.closed.emit(true),
      error: () => this.closed.emit(false),
    });
  }

  @HostListener('focusout', ['$event'])
  onAnyFieldBlur(_ev: FocusEvent) {
    this._tick.update((n) => n + 1);
  }

  // ===== Helpers =====
  private copyCompatibleValues(from: FormGroup, to: FormGroup, fields: FieldConfig[]) {
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
    const keys = this.visibleFields(stepIdx).map((f) => f.key);
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
