import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  signal,
  computed,
} from '@angular/core'; // NEW (computed)
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TenantOption } from './login.response';
import { LoginService } from './login.service';
import { Role } from '../../../core/types/role.type';
import { ApiError } from '../../../core/interceptors/api-error.interceptor';
import { Router } from '@angular/router';

type PrefillState = { email?: string; masterId?: string };

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {}

  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);

  step = signal<'credentials' | 'tenant' | 'done'>('credentials');
  loading = signal(false);
  formError = signal<string | null>(null);

  private email = '';
  private password = '';
  private prefilledMasterId: string | null = null;

  tenants = signal<ReadonlyArray<TenantOption>>([]);

  // NEW: lista “genérica” de roles (usada em credentials)
  private readonly allRoles: Role[] = [
    'master',
    'administrator',
    'teacher',
    'student',
    'worker',
  ] as const;

  // NEW: roles disponíveis conforme tenant selecionado (usado em tenant)
  availableRoles = signal<Role[]>([]);

  // NEW: opções que o select de role deve exibir (genéricas em credentials / filtradas em tenant)
  roleOptions = computed<Role[]>(() =>
    this.step() === 'tenant' ? this.availableRoles() : this.allRoles
  );

  credentialsForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['master' as Role],
    masterId: [''],
  });

  private readonly _toggleMasterIdRequired = effect(() => {
    const isTenant = this.step() === 'tenant';
    const ctrl = this.credentialsForm.get('masterId');

    if (!ctrl) return;

    if (isTenant) {
      ctrl.addValidators(Validators.required);
    } else {
      ctrl.removeValidators(Validators.required);
      // NEW: limpamos roles filtradas ao voltar para credentials
      this.availableRoles.set([]);
    }

    ctrl.updateValueAndValidity({ emitEvent: false });
  });

  // (opcional renomear)
  trackByMasterId = (_: number, t: TenantOption) => t.id;

  ngOnInit(): void {
    const st =
      (this.router.currentNavigation()?.extras.state as PrefillState) ??
      (history.state as PrefillState);

    if (st?.email) {
      this.credentialsForm.patchValue({ email: st.email });
    }
    if (st?.masterId) {
      this.step.set('tenant');
      this.prefilledMasterId = st.masterId;
      this.credentialsForm.patchValue({ masterId: st.masterId });
      // NEW: quando pré-preenchido, já calculamos as roles disponíveis
      this.updateAvailableRolesFromMasterId(st.masterId);
    }

    ['email', 'password', 'role', 'masterId'].forEach((k) => {
      this.credentialsForm.get(k)?.valueChanges.subscribe(() => this.clearApiError(k));
    });

    // NEW: ao trocar o tenant no select, recalcula as roles disponíveis
    this.credentialsForm.get('masterId')?.valueChanges.subscribe((val) => {
      if (this.step() === 'tenant') this.updateAvailableRolesFromMasterId(val as string | null);
    });
  }

  onSubmit(): void {
    const s = this.step();
    if (s === 'credentials') {
      this.onSubmitCredentials();
    } else if (s === 'tenant') {
      this.onSubmitTenant();
    }
  }

  onSubmitCredentials(): void {
    if (this.credentialsForm.invalid || this.loading()) return;

    this.formError.set(null);
    this.loading.set(true);

    const { email, password, role } = this.credentialsForm.getRawValue();
    this.email = email;
    this.password = password;

    this.loginService.discoverTenants({ email, password, role }).subscribe({
      next: (response) => {
        this.loading.set(false);

        const tenants = response?.data ?? [];
        this.tenants.set(tenants);

        if (!tenants || tenants.length === 0) {
          this.formError.set('Nenhum tenant disponível para essas credenciais/role.');
          return;
        }

        // === Caso: >= 2 tenants -> vai para 'tenant', mostrar apenas roles do tenant selecionado ===
        if (tenants.length > 1) {
          const preselected =
            (this.prefilledMasterId && tenants.find((t) => t.id === this.prefilledMasterId)) ||
            tenants[0];

          // Define role inicial coerente com o tenant escolhido
          const initialRole =
            role && preselected.roles.includes(role)
              ? role
              : preselected.roles.includes('master' as Role)
              ? ('master' as Role)
              : preselected.roles[0];

          this.step.set('tenant');
          // Primeiro define o tenant e suas roles disponíveis…
          this.credentialsForm.patchValue({ masterId: preselected.id }, { emitEvent: false });
          this.availableRoles.set(preselected.roles); // <-- filtrando roles do tenant selecionado
          // …depois ajusta a role atual se necessário
          this.credentialsForm.patchValue({ role: initialRole }, { emitEvent: false });
          return;
        }

        // === Caso: exatamente 1 tenant ===
        const t = tenants[0];

        // 1 tenant + 1 role -> login direto (mantido)
        if (t.roles.length === 1) {
          this.createSession(t.id, t.roles[0]);
          return;
        }

        // 1 tenant + N roles -> vai para 'tenant' e MOSTRA apenas as roles retornadas pela API
        const initialRole =
          role && t.roles.includes(role)
            ? role
            : t.roles.includes('master' as Role)
            ? ('master' as Role)
            : t.roles[0];

        this.step.set('tenant');
        // Define tenant, limita opções de role e aplica initialRole
        this.credentialsForm.patchValue({ masterId: t.id }, { emitEvent: false });
        this.availableRoles.set(t.roles); // <-- apenas roles da API
        this.credentialsForm.patchValue({ role: initialRole }, { emitEvent: false });
      },
      error: (e) => this.handleApiError(e),
    });
  }

  onSubmitTenant(): void {
    if (this.credentialsForm.invalid || this.loading()) return;

    this.formError.set(null);
    this.loading.set(true);

    const { masterId, role } = this.credentialsForm.getRawValue();
    this.createSession(masterId, role as Role);
  }

  private createSession(masterId: string, role: Role): void {
    this.loginService
      .createSession({
        email: this.email,
        password: this.password,
        masterId,
        role,
      })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.step.set('done');
        },
        error: (e) => this.handleApiError(e),
      });
  }

  private handleApiError(e: unknown): void {
    this.loading.set(false);

    if (e instanceof ApiError) {
      const { statusCode, body } = e.envelope;

      if (statusCode === 400 && body.code === 'BAD_REQUEST') {
        const field = (body.details as { field?: string } | undefined)?.field;

        if (this.step() === 'tenant') {
          const tenantKeys = ['masterId', 'role'] as const;
          type TenantKey = (typeof tenantKeys)[number];
          const key = tenantKeys.find((k) => k === field) as TenantKey | undefined;

          if (key) {
            this.credentialsForm.get(key)?.setErrors({ api: body.message });
          } else {
            this.formError.set(body.message);
          }
        } else {
          const credKeys = ['email', 'password', 'role'] as const;
          type CredKey = (typeof credKeys)[number];
          const key = credKeys.find((k) => k === field) as CredKey | undefined;

          if (key) {
            this.credentialsForm.get(key)?.setErrors({ api: body.message });
          } else {
            this.formError.set(body.message);
          }
        }
        return;
      }

      if (statusCode === 401) {
        this.formError.set('Não autorizado: verifique email, senha, tenant e role.');
        return;
      }

      this.formError.set(body.message || 'Erro inesperado.');
      return;
    }

    this.formError.set('Erro inesperado.');
  }

  backToCredentials(): void {
    if (this.loading()) return;
    this.step.set('credentials');
    this.formError.set(null);
    this.tenants.set([]);
    this.availableRoles.set([]); // NEW
    this.credentialsForm.reset({
      masterId: this.prefilledMasterId ?? '',
      role: 'master',
    });
  }

  get submitDisabled(): boolean {
    const f = this.credentialsForm;
    const credsInvalid =
      !!f.get('email')?.invalid || !!f.get('password')?.invalid || !!f.get('role')?.invalid;

    const tenantInvalid = this.step() === 'tenant' ? !!f.get('masterId')?.invalid : false;

    return this.loading() || credsInvalid || tenantInvalid;
  }

  private clearApiError(key: string) {
    const c = this.credentialsForm.get(key);
    if (!c) return;
    const errors = c.errors;
    if (errors?.['api']) {
      const { api, ...rest } = errors;
      c.setErrors(Object.keys(rest).length ? rest : null);
    }
  }

  // NEW: recalcula roles disponíveis conforme o tenant selecionado
  private updateAvailableRolesFromMasterId(masterId?: string | null) {
    const tid = masterId ?? (this.credentialsForm.get('masterId')?.value as string | null);
    const t = this.tenants().find((tt) => tt.id === tid);
    const roles = t?.roles ?? [];
    this.availableRoles.set(roles);

    const currentRole = this.credentialsForm.get('role')!.value as Role | null;
    if (!currentRole || !roles.includes(currentRole)) {
      // troca a role do form para uma permitida pelo tenant selecionado (ou limpa)
      const nextRole = roles[0] ?? null;
      this.credentialsForm.patchValue({ role: nextRole as any }, { emitEvent: false });
    }
  }
}
