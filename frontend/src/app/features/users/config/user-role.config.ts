import { provideRole } from '../data-access/tokens/role-wizard-registry.token';
import { FieldConfig, RoleWizardConfig } from './roles';
import {
  ADMIN_PROFILE_SERVICE_TOKEN,
  TEACHER_PROFILE_SERVICE_TOKEN,
  STUDENT_PROFILE_SERVICE_TOKEN,
  WORKER_PROFILE_SERVICE_TOKEN,
  MASTER_PROFILE_SERVICE_TOKEN,
} from '../data-access/tokens/user-service-token';

// ====== Helpers ======
const toYMD = (d?: string | Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : null);

const toName = (n: any) => {
  const first = n?.firstName?.trim?.() ?? '';
  const last = n?.lastName?.trim?.() ?? '';
  const middle = n?.middleName?.trim?.() ?? '';
  return {
    firstName: first,
    lastName: last,
    ...(middle ? { middleName: middle } : {}),
  };
};

// ====== Campos comuns (BASE) ======
// IMPORTANTE: preserveOnRoleChange: true nos campos base
const COMMON_FIELDS: FieldConfig[] = [
  {
    key: 'name',
    label: 'Nome',
    type: 'name',
    validators: [{ name: 'required' }],
    preserveOnRoleChange: true,
  },
  {
    key: 'email',
    label: 'E-mail',
    type: 'email',
    validators: [{ name: 'required' }, { name: 'email' }],
    preserveOnRoleChange: true,
  },
  { key: 'birthday', label: 'Nascimento', type: 'date', preserveOnRoleChange: true },
  { key: 'address', label: 'Endereço', type: 'address', preserveOnRoleChange: true },
];

// ====== ADMIN ======
export const ADMIN_CONFIG: RoleWizardConfig = {
  role: 'administrator',
  label: 'Administrador(a)',
  steps: [
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'] },
    { title: 'Endereço', fields: ['address'] },
    // inclui graduation aqui
    { title: 'Profissional', fields: ['graduation', 'salary'] },
  ],
  fields: [
    ...COMMON_FIELDS,
    // extras (não preservados por padrão)
    { key: 'graduation', label: 'Graduação', type: 'text' },
    {
      key: 'salary',
      label: 'Salário',
      type: 'salary',
      validators: [{ name: 'custom', args: 'positiveMoney' }],
    },
  ],
  // defaults alinhados ao DynamicField de salary => { salary, currency }
  defaults: {
    graduation: '',
    salary: { salary: null, currency: 'R$' },
  },
  toRequest: (v: any) => ({
    ...v,
    name: toName(v?.name),
    birthday: toYMD(v?.birthday),
    // backend espera objeto { salary, currency }
    salary: v?.salary ?? null,
  }),
  serviceToken: ADMIN_PROFILE_SERVICE_TOKEN,
  capabilities: { canList: true, canEdit: true },
};

// ====== TEACHER ======
export const TEACHER_CONFIG: RoleWizardConfig = {
  role: 'teacher',
  label: 'Professor(a)',
  steps: [
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'] },
    { title: 'Endereço', fields: ['address'] },
    { title: 'Profissional', fields: ['graduation', 'academicDegrees', 'salary'] },
  ],
  fields: [
    ...COMMON_FIELDS,
    { key: 'graduation', label: 'Graduação', type: 'text' },
    { key: 'academicDegrees', label: 'Título Acadêmico', type: 'text' },
    {
      key: 'salary',
      label: 'Salário',
      type: 'salary',
      validators: [{ name: 'custom', args: 'positiveMoney' }],
    },
  ],
  defaults: {
    graduation: '',
    academicDegrees: '',
    salary: { salary: null, currency: 'R$' },
  },
  toRequest: (v: any) => ({
    ...v,
    name: toName(v?.name),
    birthday: toYMD(v?.birthday),
    salary: v?.salary ?? null, // objeto
  }),
  serviceToken: TEACHER_PROFILE_SERVICE_TOKEN,
  capabilities: { canList: true, canEdit: true },
};

// ====== STUDENT ======
export const STUDENT_CONFIG: RoleWizardConfig = {
  role: 'student',
  label: 'Aluno(a)',
  steps: [
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'] },
    { title: 'Endereço', fields: ['address'] },
    { title: 'Matrícula', fields: ['paymentYear'] },
  ],
  fields: [...COMMON_FIELDS, { key: 'paymentYear', label: 'Pagamento Anual', type: 'number' }],
  defaults: {
    paymentYear: null, // ou ano corrente se preferir
  },
  toRequest: (v: any) => ({
    ...v,
    name: toName(v?.name),
    birthday: toYMD(v?.birthday),
  }),
  serviceToken: STUDENT_PROFILE_SERVICE_TOKEN,
  capabilities: { canList: true, canEdit: true },
};

// ====== WORKER ======
export const WORKER_CONFIG: RoleWizardConfig = {
  role: 'worker',
  label: 'Colaborador(a)',
  steps: [
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'] },
    { title: 'Endereço', fields: ['address'] },
    { title: 'Profissional', fields: ['salary'] },
  ],
  fields: [
    ...COMMON_FIELDS,
    {
      key: 'salary',
      label: 'Salário',
      type: 'salary',
      validators: [{ name: 'custom', args: 'positiveMoney' }],
    },
  ],
  defaults: {
    salary: { salary: null, currency: 'R$' },
  },
  toRequest: (v: any) => ({
    ...v,
    name: toName(v?.name),
    birthday: toYMD(v?.birthday),
    salary: v?.salary ?? null, // objeto
  }),
  serviceToken: WORKER_PROFILE_SERVICE_TOKEN,
  capabilities: { canList: true, canEdit: true },
};

// ====== MASTER (sem list) ======
export const MASTER_CONFIG: RoleWizardConfig = {
  role: 'master',
  label: 'Master',
  steps: [
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'] },
    { title: 'Endereço', fields: ['address'] },
    { title: 'Documentos', fields: ['cnpj'] },
  ],
  fields: [
    ...COMMON_FIELDS,
    { key: 'cnpj', label: 'CNPJ', type: 'cnpj', validators: [{ name: 'custom', args: 'cnpj' }] },
  ],
  defaults: {
    cnpj: '', // ou null, conforme seu DynamicField
  },
  toRequest: (v: any) => ({
    ...v,
    name: toName(v?.name),
    birthday: toYMD(v?.birthday),
  }),
  serviceToken: MASTER_PROFILE_SERVICE_TOKEN,
  capabilities: { canList: false, canEdit: true },
};

// ====== Providers de configs ======
export const provideRoleWizardConfigs = () => [
  provideRole(ADMIN_CONFIG),
  provideRole(TEACHER_CONFIG),
  provideRole(STUDENT_CONFIG),
  provideRole(WORKER_CONFIG),
  provideRole(MASTER_CONFIG),
];
