import { TeacherProfileRequest } from '../../../data-access';
import { TEACHER_PROFILE_SERVICE } from '../core/tokens';
import { RoleWizardConfig } from '../core/types';

const toYMD = (d?: string | Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : null);
const toName = (n: any) => {
  const first = n?.firstName?.trim?.() ?? '';
  const last = n?.lastName?.trim?.() ?? '';
  const middle = n?.middleName?.trim?.() ?? '';
  return { firstName: first, lastName: last, ...(middle ? { middleName: middle } : {}) };
};

export const teacherConfig: RoleWizardConfig<unknown, TeacherProfileRequest> = {
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
    salary: { salary: null, currency: 'R$' } as any,
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
