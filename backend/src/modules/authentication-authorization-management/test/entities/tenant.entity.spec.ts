import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Tenant from '@/modules/authentication-authorization-management/domain/entity/tenant.entity';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('Tenant entity', () => {
  const validCnpj = '11444777000161';
  const tenantId = new Id().value;
  let tenant: Tenant;
  const oldEmail = 'old@example.com';
  const newEmail = 'new@example.com';

  beforeEach(() => {
    tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
    tenant.addTenantUserRole(oldEmail, RoleUsersEnum.STUDENT);
  });

  describe('Failure cases', () => {
    it('should throw an error when id is invalid', () => {
      expect(() => new Tenant({ id: 'not-a-uuid', cnpj: validCnpj })).toThrow(
        'Invalid tenant ID'
      );
    });

    it('should throw an error when CNPJ is invalid', () => {
      expect(() => new Tenant({ id: tenantId, cnpj: '123' })).toThrow(
        'Invalid CNPJ'
      );
    });

    it('should throw an error when setting invalid CNPJ', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      expect(() => {
        tenant.cnpj = 'invalid';
      }).toThrow('Invalid CNPJ');
    });

    it('should throw when adding a duplicate active role', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      const email = 'user@example.com';
      tenant.addTenantUserRole(email, RoleUsersEnum.STUDENT);
      expect(() =>
        tenant.addTenantUserRole(email, RoleUsersEnum.STUDENT)
      ).toThrow(`User already has the role 'student' active in this tenant.`);
    });

    it('should throw when changing to or from MASTER role', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      const email = 'user@example.com';
      expect(() =>
        tenant.changeTenantUserRole(
          email,
          RoleUsersEnum.MASTER,
          RoleUsersEnum.STUDENT
        )
      ).toThrow('Changing the MASTER role is not allowed.');
      expect(() =>
        tenant.changeTenantUserRole(
          email,
          RoleUsersEnum.STUDENT,
          RoleUsersEnum.MASTER
        )
      ).toThrow('Changing the MASTER role is not allowed.');
    });

    it('should throw when old role not found', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      const email = 'user2@example.com';
      expect(() =>
        tenant.changeTenantUserRole(
          email,
          RoleUsersEnum.TEACHER,
          RoleUsersEnum.STUDENT
        )
      ).toThrow(`Old role 'teacher' not found for user ${email}.`);
    });

    it('should throw when new role is already active', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      const email = 'user3@example.com';
      tenant.addTenantUserRole(email, RoleUsersEnum.STUDENT);
      tenant.changeTenantUserRole(
        email,
        RoleUsersEnum.STUDENT,
        RoleUsersEnum.TEACHER
      );
      expect(() =>
        tenant.changeTenantUserRole(
          email,
          RoleUsersEnum.STUDENT,
          RoleUsersEnum.TEACHER
        )
      ).toThrow(`User already has the role 'teacher' active in this tenant.`);
    });

    it('should throw if oldEmail does not exist', () => {
      expect(() => {
        tenant.renameUserEmail('missing@example.com', newEmail);
      }).toThrow(`No roles found for user missing@example.com`);
    });

    it('should throw if newEmail already exists', () => {
      tenant.addTenantUserRole(newEmail, RoleUsersEnum.TEACHER);
      expect(() => {
        tenant.renameUserEmail(oldEmail, newEmail);
      }).toThrow(`A user already exists with email ${newEmail}`);
    });

    it('should throw if oldEmail or newEmail is empty or not a string', () => {
      expect(() => tenant.renameUserEmail('', newEmail)).toThrow(
        'Invalid email value'
      );
      expect(() => tenant.renameUserEmail(oldEmail, '')).toThrow(
        'Invalid email value'
      );
      expect(() => (tenant.renameUserEmail as any)(123, newEmail)).toThrow(
        'Invalid email value'
      );
      expect(() => (tenant.renameUserEmail as any)(oldEmail, true)).toThrow(
        'Invalid email value'
      );
    });

    it('should throw an error when cnpj is not a string in constructor', () => {
      //@ts-expect-error
      expect(() => new Tenant({ id: tenantId, cnpj: 123 })).toThrow(
        'Invalid CNPJ'
      );
    });

    it('should throw an error when cnpj is not a string in setter', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      expect(() => {
        //@ts-expect-error
        tenant.cnpj = 123;
      }).toThrow('Invalid CNPJ');
    });
  });

  describe('Success cases', () => {
    it('should create tenant with valid id and CNPJ', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      expect(tenant.id).toBe(tenantId);
      expect(tenant.cnpj).toBe(validCnpj);
    });

    it('should set CNPJ with a valid value', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      expect(() => {
        tenant.cnpj = validCnpj;
      }).not.toThrow();
      expect(tenant.cnpj).toBe(validCnpj);
    });

    it('should add a new TenantUserRole', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      const email = 'user4@example.com';
      tenant.addTenantUserRole(email, RoleUsersEnum.STUDENT);
      const roles = tenant.tenantUserRolesMap.get(email)!;
      expect(roles).toHaveLength(1);
      expect(roles[0].role).toBe(RoleUsersEnum.STUDENT);
      expect(roles[0].isActive).toBe(true);
    });

    it('should reactivate an inactive role', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      const email = 'user5@example.com';
      tenant.addTenantUserRole(email, RoleUsersEnum.STUDENT);

      const roles = tenant.tenantUserRolesMap.get(email)!;
      roles[0].deactivate();
      expect(roles[0].isActive).toBe(false);

      tenant.addTenantUserRole(email, RoleUsersEnum.STUDENT);
      expect(roles[0].isActive).toBe(true);
    });

    it('should not change anything when oldRole equals newRole', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      const email = 'user6@example.com';
      tenant.addTenantUserRole(email, RoleUsersEnum.STUDENT);
      const before = tenant.tenantUserRolesMap.get(email)!;

      tenant.changeTenantUserRole(
        email,
        RoleUsersEnum.STUDENT,
        RoleUsersEnum.STUDENT
      );

      const after = tenant.tenantUserRolesMap.get(email)!;
      expect(after).toEqual(before);
    });

    it('should change role by deactivating old and adding new', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      const email = 'user7@example.com';
      tenant.addTenantUserRole(email, RoleUsersEnum.STUDENT);

      tenant.changeTenantUserRole(
        email,
        RoleUsersEnum.STUDENT,
        RoleUsersEnum.TEACHER
      );

      const roles = tenant.tenantUserRolesMap.get(email)!;
      const oldRole = roles.find(r => r.role === RoleUsersEnum.STUDENT)!;
      const newRole = roles.find(r => r.role === RoleUsersEnum.TEACHER)!;
      expect(oldRole.isActive).toBe(false);
      expect(newRole.isActive).toBe(true);
    });

    it('should reactivate an existing inactive newRole and deactivate oldRole', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      const email = 'user8@example.com';
      // Add both roles
      tenant.addTenantUserRole(email, RoleUsersEnum.STUDENT);
      tenant.addTenantUserRole(email, RoleUsersEnum.TEACHER);

      const roles = tenant.tenantUserRolesMap.get(email)!;
      const teacherRole = roles.find(r => r.role === RoleUsersEnum.TEACHER)!;
      teacherRole.deactivate();
      expect(teacherRole.isActive).toBe(false);

      tenant.changeTenantUserRole(
        email,
        RoleUsersEnum.STUDENT,
        RoleUsersEnum.TEACHER
      );

      expect(roles.find(r => r.role === RoleUsersEnum.STUDENT)!.isActive).toBe(
        false
      );
      expect(teacherRole.isActive).toBe(true);
    });

    it('should rename the user email key preserving roles', () => {
      const before = tenant.tenantUserRolesMap.get(oldEmail);
      expect(before).toBeDefined();
      expect(tenant.tenantUserRolesMap.has(newEmail)).toBe(false);

      tenant.renameUserEmail(oldEmail, newEmail);

      expect(tenant.tenantUserRolesMap.has(oldEmail)).toBe(false);
      const after = tenant.tenantUserRolesMap.get(newEmail);
      expect(after).toBe(before);
      expect(after![0].role).toBe(RoleUsersEnum.STUDENT);
      expect(after![0].isActive).toBe(true);
    });

    it('should initialize with empty tenantUserRolesMap', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      expect(tenant.tenantUserRolesMap.size).toBe(0);
    });

    it('should throw an error when renaming to the same email', () => {
      const tenant = new Tenant({ id: tenantId, cnpj: validCnpj });
      const oldEmail = 'user@example.com';

      tenant.addTenantUserRole(oldEmail, RoleUsersEnum.MASTER);

      expect(() => tenant.renameUserEmail(oldEmail, oldEmail)).toThrow(
        `A user already exists with email ${oldEmail}`
      );
    });
  });
});
