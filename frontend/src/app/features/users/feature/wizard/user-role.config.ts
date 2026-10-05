import { FieldConfig, RoleWizardConfig } from './core/types';
import {
  ADMIN_PROFILE_SERVICE,
  TEACHER_PROFILE_SERVICE,
  STUDENT_PROFILE_SERVICE,
  WORKER_PROFILE_SERVICE,
  MASTER_PROFILE_SERVICE,
} from './core/tokens';
import { AdministratorProfileRequest } from '../../data-access/dto/administrator/administrator.request';
import { TeacherProfileRequest } from '../../data-access/dto/teacher/teacher.request';
import { StudentProfileRequest } from '../../data-access/dto/student/student.request';
import { WorkerProfileRequest } from '../../data-access/dto/worker/worker.request';
import { MasterProfileRequest } from '../../data-access/dto/master/master.request';

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
  {
    key: 'birthday',
    label: 'Nascimento (YYYY-MM-DD)',
    type: 'date',
    validators: [{ name: 'required' }],
    preserveOnRoleChange: true,
  },
  { key: 'address', label: 'Endereço', type: 'address', preserveOnRoleChange: true },
];

// ====== ADMIN ======
export const ADMIN_CONFIG: RoleWizardConfig<any, AdministratorProfileRequest> = {
  role: 'administrator',
  label: 'Administrador(a)',
  steps: [
    { title: 'Contato', fields: ['email'], showOn: ['partial'] },
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'], showOn: ['full'] },
    { title: 'Endereço', fields: ['address'], showOn: ['full'] },
    { title: 'Profissional', fields: ['graduation', 'salary'], showOn: ['full', 'partial'] },
  ],
  fields: [
    ...COMMON_FIELDS,
    { key: 'graduation', label: 'Graduação', type: 'text' },
    {
      key: 'salary',
      label: 'Salário',
      type: 'salary',
      validators: [{ name: 'custom', args: 'positiveMoney' }],
    },
  ],
  defaults: {
    graduation: '',
    salary: { salary: null, currency: 'R$' },
  },
  toRequest: (v: any) => ({
    ...v,
    name: toName(v?.name),
    birthday: toYMD(v?.birthday),
    salary: v?.salary ?? null,
  }),
  serviceToken: ADMIN_PROFILE_SERVICE,
  capabilities: { canList: true, canEdit: true },
};

// ====== TEACHER ======
export const TEACHER_CONFIG: RoleWizardConfig<any, TeacherProfileRequest> = {
  role: 'teacher',
  label: 'Professor(a)',
  steps: [
    { title: 'Contato', fields: ['email'], showOn: ['partial'] },
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'], showOn: ['full'] },
    { title: 'Endereço', fields: ['address'], showOn: ['full'] },
    {
      title: 'Profissional',
      fields: ['graduation', 'academicDegrees', 'salary'],
      showOn: ['full', 'partial'],
    },
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
    salary: v?.salary ?? null,
  }),
  serviceToken: TEACHER_PROFILE_SERVICE,
  capabilities: { canList: true, canEdit: true },
};

// ====== STUDENT ======
export const STUDENT_CONFIG: RoleWizardConfig<any, StudentProfileRequest> = {
  role: 'student',
  label: 'Aluno(a)',
  steps: [
    { title: 'Contato', fields: ['email'], showOn: ['partial'] },
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'], showOn: ['full'] },
    { title: 'Endereço', fields: ['address'], showOn: ['full'] },
    { title: 'Matrícula', fields: ['paymentYear'], showOn: ['full', 'partial'] },
  ],
  fields: [...COMMON_FIELDS, { key: 'paymentYear', label: 'Pagamento Anual', type: 'number' }],
  defaults: {
    paymentYear: null,
  },
  toRequest: (v: any) => ({
    ...v,
    name: toName(v?.name),
    birthday: toYMD(v?.birthday),
  }),
  serviceToken: STUDENT_PROFILE_SERVICE,
  capabilities: { canList: true, canEdit: true },
};

// ====== WORKER ======
export const WORKER_CONFIG: RoleWizardConfig<any, WorkerProfileRequest> = {
  role: 'worker',
  label: 'Colaborador(a)',
  steps: [
    { title: 'Contato', fields: ['email'], showOn: ['partial'] },
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'], showOn: ['full'] },
    { title: 'Endereço', fields: ['address'], showOn: ['full'] },
    { title: 'Profissional', fields: ['salary'], showOn: ['full', 'partial'] },
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
    salary: v?.salary ?? null,
  }),
  serviceToken: WORKER_PROFILE_SERVICE,
  capabilities: { canList: true, canEdit: true },
};

export const MASTER_CONFIG: RoleWizardConfig<any, MasterProfileRequest> = {
  role: 'master',
  label: 'Master',
  steps: [
    { title: 'Contato', fields: ['email'], showOn: ['partial'] },
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'], showOn: ['full'] },
    { title: 'Endereço', fields: ['address'], showOn: ['full'] },
  ],
  fields: [...COMMON_FIELDS],
  toRequest: (v: any) => ({
    ...v,
    name: toName(v?.name),
    birthday: toYMD(v?.birthday),
  }),
  serviceToken: MASTER_PROFILE_SERVICE,
  capabilities: { canList: false, canEdit: true },
};
