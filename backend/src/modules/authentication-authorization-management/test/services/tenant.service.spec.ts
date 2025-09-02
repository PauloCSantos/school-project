import Tenant from '@/modules/authentication-authorization-management/domain/entity/tenant.entity';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import {
  CreateTenantInputDto,
  TenantService,
  TenantServiceInterface,
} from '../../domain/service/tenant.service';

describe('TenantService', () => {
  let service: TenantServiceInterface;
  let tenantGateway: jest.Mocked<TenantGateway>;
  const masterId = 'master-id';
  const email = 'user@example.com';
  const validCnpj = '12.345.678/0001-95';

  beforeEach(() => {
    tenantGateway = {
      find: jest.fn(),
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<TenantGateway>;
    service = new TenantService(tenantGateway);
  });

  describe('Failure cases', () => {
    it('manageUserRoleAssignmentInTenant should throw if creating new tenant without cnpj', async () => {
      tenantGateway.find.mockResolvedValue(null);
      const dto: CreateTenantInputDto = { email, role: RoleUsersEnum.MASTER };
      await expect(service.manageUserRoleAssignmentInTenant(dto)).rejects.toThrow(
        'CNPJ is mandatory to create a new tenant'
      );
    });

    it('changeUserRoleInTenant should throw if tenant not found', async () => {
      tenantGateway.find.mockResolvedValue(null);
      await expect(
        service.changeUserRoleInTenant(
          masterId,
          email,
          RoleUsersEnum.ADMINISTRATOR,
          RoleUsersEnum.STUDENT
        )
      ).rejects.toThrow('Tenant not found');
    });

    it('getTenant should throw if no id provided', async () => {
      await expect(service.getTenant()).rejects.toThrow('Tenant not found');
    });

    it('getTenant should throw if tenant not found', async () => {
      tenantGateway.find.mockResolvedValue(null);
      await expect(service.getTenant(masterId)).rejects.toThrow('Tenant not found');
    });

    it('verifyTenantRole should throw if tenant not found', async () => {
      tenantGateway.find.mockResolvedValue(null);
      await expect(
        service.verifyTenantRole(masterId, email, RoleUsersEnum.MASTER)
      ).rejects.toThrow('Tenant not found');
    });

    it('verifyTenantRole should throw if role not assigned', async () => {
      const stubTenant = {
        tenantUserRolesMap: new Map<string, any[]>(),
      } as unknown as Tenant;
      tenantGateway.find.mockResolvedValue(stubTenant);
      await expect(
        service.verifyTenantRole(masterId, email, RoleUsersEnum.ADMINISTRATOR)
      ).rejects.toThrow(
        `The user "${email}" does not have the role "${RoleUsersEnum.ADMINISTRATOR}" registered`
      );
    });

    it('verifyTenantRole should throw if role assigned but inactive', async () => {
      const stubTenant = {
        tenantUserRolesMap: new Map([
          [
            email,
            [
              {
                _email: email,
                role: RoleUsersEnum.ADMINISTRATOR,
                isActive: false,
              },
            ],
          ],
        ]),
      } as unknown as Tenant;
      tenantGateway.find.mockResolvedValue(stubTenant);
      await expect(
        service.verifyTenantRole(masterId, email, RoleUsersEnum.ADMINISTRATOR)
      ).rejects.toThrow(
        `The role "${RoleUsersEnum.ADMINISTRATOR}" of the user "${email}" is inactive`
      );
    });
  });

  describe('Success cases', () => {
    it('manageUserRoleAssignmentInTenant should assign to existing tenant and return isNew=false', async () => {
      const stubTenant = { addTenantUserRole: jest.fn() } as unknown as Tenant;
      tenantGateway.find.mockResolvedValue(stubTenant);
      const dto: CreateTenantInputDto = {
        email,
        role: RoleUsersEnum.ADMINISTRATOR,
        masterId,
        cnpj: 'ignored',
      };

      const result = await service.manageUserRoleAssignmentInTenant(dto);

      expect(tenantGateway.find).toHaveBeenCalledWith(masterId);
      expect(stubTenant.addTenantUserRole).toHaveBeenCalledWith(
        email,
        RoleUsersEnum.ADMINISTRATOR
      );
      expect(result).toEqual({ tenant: stubTenant, isNew: false });
    });

    it('manageUserRoleAssignmentInTenant should create new tenant when not found and return isNew=true', async () => {
      tenantGateway.find.mockResolvedValue(null);
      const dto: CreateTenantInputDto = {
        email,
        role: RoleUsersEnum.ADMINISTRATOR,
        cnpj: validCnpj,
      };

      const result = await service.manageUserRoleAssignmentInTenant(dto);

      expect(result.isNew).toBe(true);
      expect(result.tenant).toBeInstanceOf(Tenant);
      expect(result.tenant.cnpj).toBe(validCnpj);

      const roles = result.tenant.tenantUserRolesMap.get(email)!;
      expect(roles).toHaveLength(1);
      expect(roles[0].role).toBe(RoleUsersEnum.ADMINISTRATOR);
      expect(roles[0].isActive).toBe(true);
    });

    it('changeUserRoleInTenant should call changeTenantUserRole and return the tenant', async () => {
      const stubTenant = {
        changeTenantUserRole: jest.fn(),
      } as unknown as Tenant;
      tenantGateway.find.mockResolvedValue(stubTenant);

      const result = await service.changeUserRoleInTenant(
        masterId,
        email,
        RoleUsersEnum.ADMINISTRATOR,
        RoleUsersEnum.TEACHER
      );

      expect(stubTenant.changeTenantUserRole).toHaveBeenCalledWith(
        email,
        RoleUsersEnum.ADMINISTRATOR,
        RoleUsersEnum.TEACHER
      );
      expect(result).toBe(stubTenant);
    });

    it('getTenant should return found tenant', async () => {
      const stubTenant = {} as Tenant;
      tenantGateway.find.mockResolvedValue(stubTenant);

      const result = await service.getTenant(masterId);

      expect(result).toBe(stubTenant);
    });

    it('verifyTenantRole should resolve when role assigned and active', async () => {
      const stubTenant = {
        tenantUserRolesMap: new Map([
          [
            email,
            [
              {
                _email: email,
                role: RoleUsersEnum.ADMINISTRATOR,
                isActive: true,
              },
            ],
          ],
        ]),
      } as unknown as Tenant;
      tenantGateway.find.mockResolvedValue(stubTenant);

      await expect(
        service.verifyTenantRole(masterId, email, RoleUsersEnum.ADMINISTRATOR)
      ).resolves.toBeUndefined();
    });

    it('getAvailableTenantsAndRoles should return only active roles per tenant', async () => {
      const t1 = {
        id: 't1',
        tenantUserRolesMap: new Map([
          [
            email,
            [
              {
                _email: email,
                role: RoleUsersEnum.ADMINISTRATOR,
                isActive: true,
              },
              {
                _email: email,
                role: RoleUsersEnum.ADMINISTRATOR,
                isActive: false,
              },
            ],
          ],
        ]),
      } as unknown as Tenant;
      const t2 = {
        id: 't2',
        tenantUserRolesMap: new Map([
          [
            email,
            [
              {
                _email: email,
                role: RoleUsersEnum.ADMINISTRATOR,
                isActive: true,
              },
            ],
          ],
        ]),
      } as unknown as Tenant;

      tenantGateway.findByEmail.mockResolvedValue([t1, t2]);

      const result = await service.getAvailableTenantsAndRoles(email);

      expect(result).toEqual([
        { id: 't1', roles: [RoleUsersEnum.ADMINISTRATOR] },
        { id: 't2', roles: [RoleUsersEnum.ADMINISTRATOR] },
      ]);
    });
  });
});
