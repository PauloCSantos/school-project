import { RoleUsersEnum, StatesEnum } from '@/modules/@shared/enums/enums';
import { TenantUserRole } from '../../domain/entity/tenant-user.entity';

describe('TenantUserRole entity', () => {
  const validEmail = 'user@example.com';

  describe('Failure cases', () => {
    it('should throw an error when email is empty', () => {
      expect(
        () => new TenantUserRole({ email: '', role: RoleUsersEnum.STUDENT })
      ).toThrow('Field email is not valid');
    });

    it('should throw an error when email format is invalid', () => {
      expect(
        () =>
          new TenantUserRole({
            email: 'not-an-email',
            role: RoleUsersEnum.STUDENT,
          })
      ).toThrow('Field email is not valid');
    });

    it('should throw an error when role is not in the enum', () => {
      const badRole = 'INVALID_ROLE' as any;
      expect(() => new TenantUserRole({ email: validEmail, role: badRole })).toThrow(
        `Invalid role`
      );
    });
  });

  describe('Success cases', () => {
    it('should create with default flags', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
      });
      expect(tenantUserRole.role).toBe(RoleUsersEnum.STUDENT);
      expect(tenantUserRole.isActive).toBe(true);
    });

    it('should respect initial isActive and needVerification flags', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
        state: StatesEnum.PENDING,
      });
      expect(tenantUserRole.isActive).toBe(true);
    });

    it('should deactivate the role', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
      });
      tenantUserRole.deactivate();
      expect(tenantUserRole.isActive).toBe(false);
    });

    it('should activate the role with verification requirement', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
        state: StatesEnum.INACTIVE,
      });
      tenantUserRole.reactivate(true);
      expect(tenantUserRole.isActive).toBe(true);
      expect(tenantUserRole.isPending).toBe(true);
    });

    it('should activate the role without verification requirement by default', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
        state: StatesEnum.INACTIVE,
      });
      tenantUserRole.reactivate();
      expect(tenantUserRole.isActive).toBe(true);
      expect(tenantUserRole.isPending).toBe(false);
    });

    it('should clear needVerification when marked as verified', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
        state: StatesEnum.PENDING,
      });
      tenantUserRole.markVerified();
      expect(tenantUserRole.isPending).toBe(false);
    });
  });
});
