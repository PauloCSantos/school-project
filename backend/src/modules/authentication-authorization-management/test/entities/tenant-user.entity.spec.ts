import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
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
      expect(
        () => new TenantUserRole({ email: validEmail, role: badRole })
      ).toThrow(`Invalid role: ${badRole}`);
    });

    it('should throw an error when isActive is not boolean', () => {
      expect(
        () =>
          new TenantUserRole({
            email: validEmail,
            role: RoleUsersEnum.STUDENT,
            //@ts-expect-error
            isActive: 'true',
          })
      ).toThrow('The field isActive must be a boolean');
    });

    it('should throw an error when needVerification is not boolean', () => {
      expect(
        () =>
          new TenantUserRole({
            email: validEmail,
            role: RoleUsersEnum.STUDENT,
            //@ts-expect-error
            needVerification: 'false',
          })
      ).toThrow('The field needVerification must be a boolean');
    });
  });

  describe('Success cases', () => {
    it('should create with default flags false', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
      });
      expect(tenantUserRole.role).toBe(RoleUsersEnum.STUDENT);
      expect(tenantUserRole.isActive).toBe(false);
      expect(tenantUserRole.needVerification).toBe(false);
    });

    it('should respect initial isActive and needVerification flags', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
        isActive: true,
        needVerification: true,
      });
      expect(tenantUserRole.isActive).toBe(true);
      expect(tenantUserRole.needVerification).toBe(true);
    });

    it('should deactivate the role', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
        isActive: true,
      });
      tenantUserRole.deactivate();
      expect(tenantUserRole.isActive).toBe(false);
    });

    it('should activate the role with verification requirement', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
      });
      tenantUserRole.activate(true);
      expect(tenantUserRole.isActive).toBe(true);
      expect(tenantUserRole.needVerification).toBe(true);
    });

    it('should activate the role without verification requirement by default', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
      });
      tenantUserRole.activate();
      expect(tenantUserRole.isActive).toBe(true);
      expect(tenantUserRole.needVerification).toBe(false);
    });

    it('should clear needVerification when marked as verified', () => {
      const tenantUserRole = new TenantUserRole({
        email: validEmail,
        role: RoleUsersEnum.STUDENT,
        isActive: true,
        needVerification: true,
      });
      tenantUserRole.markVerified();
      expect(tenantUserRole.needVerification).toBe(false);
    });
  });
});
