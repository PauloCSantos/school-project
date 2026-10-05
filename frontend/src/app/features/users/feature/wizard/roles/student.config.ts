import { StudentProfileRequest } from '../../../data-access';
import { STUDENT_PROFILE_SERVICE } from '../core/tokens';
import { RoleWizardConfig } from '../core/types';

const toYMD = (d?: string | Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : null);
const toName = (n: any) => {
  const first = n?.firstName?.trim?.() ?? '';
  const last = n?.lastName?.trim?.() ?? '';
  const middle = n?.middleName?.trim?.() ?? '';
  return { firstName: first, lastName: last, ...(middle ? { middleName: middle } : {}) };
};

export const studentConfig: RoleWizardConfig<unknown, StudentProfileRequest> = {
  role: 'student',
  label: 'Aluno(a)',
  steps: [
    { title: 'Contato', fields: ['email'], showOn: ['partial'] },
    { title: 'Dados pessoais', fields: ['name', 'email', 'birthday'], showOn: ['full'] },
    { title: 'Endereço', fields: ['address'], showOn: ['full'] },
    { title: 'Matrícula', fields: ['paymentYear'], showOn: ['full', 'partial'] },
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
    { key: 'paymentYear', label: 'Pagamento Anual', type: 'number' },
  ],
  defaults: {
    paymentYear: null as any,
  },
  toRequest: (v: any) => ({
    ...v,
    name: toName(v?.name),
    birthday: toYMD(v?.birthday),
  }),
  serviceToken: STUDENT_PROFILE_SERVICE,
  capabilities: { canList: true, canEdit: true },
};
