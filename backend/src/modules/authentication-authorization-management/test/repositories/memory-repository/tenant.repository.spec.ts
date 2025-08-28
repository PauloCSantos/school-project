import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import Tenant from '@/modules/authentication-authorization-management/domain/entity/tenant.entity';
import MemoryTenantRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/tenant.repository';

describe('MemoryTenantRepository unit test', () => {
  let repository: MemoryTenantRepository;

  const tenant1 = new Tenant({ id: new Id().value, cnpj: '00000000000191' });
  const tenant2 = new Tenant({ id: new Id().value, cnpj: '00000000000272' });
  const tenant3 = new Tenant({ id: new Id().value, cnpj: '00000000000353' });

  beforeEach(() => {
    repository = new MemoryTenantRepository([tenant1, tenant2]);
  });

  describe('On fail', () => {
    it('should return null if tenant not found', async () => {
      const found = await repository.find('nonexistent-id');
      expect(found).toBeNull();
    });

    it('should throw an error when updating a non-existent tenant', async () => {
      await expect(repository.update('nonexistent-id', tenant3)).rejects.toThrow(
        'Tenant not found'
      );
    });

    it('should throw an error when deleting a non-existent tenant', async () => {
      await expect(repository.delete(tenant3)).rejects.toThrow('Tenant not found');
    });

    it('should throw an error when creating a tenant with an existing id', async () => {
      await expect(repository.create(tenant1)).rejects.toThrow('Tenant already exists');
    });
  });

  describe('On success', () => {
    it('should find an existing tenant by id', async () => {
      const found = await repository.find(tenant1.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(tenant1.id);
      expect(found!.cnpj).toBe(tenant1.cnpj);
    });

    it('should create a new tenant and allow finding it', async () => {
      await repository.create(tenant3);
      const found = await repository.find(tenant3.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(tenant3.id);
      expect(found!.cnpj).toBe(tenant3.cnpj);
    });

    it("should update an existing tenant's cnpj", async () => {
      const newCnpj = '00000000000193';
      tenant2.cnpj = newCnpj;
      await repository.update(tenant2.id, tenant2);
      const found = await repository.find(tenant2.id);
      expect(found).toBeDefined();
      expect(found!.cnpj).toBe(newCnpj);
    });

    it('should delete an existing tenant', async () => {
      tenant1.addTenantUserRole('test@t.com', RoleUsersEnum.STUDENT);
      await repository.update(tenant1.id, tenant1);

      const role = tenant1.tenantUserRolesMap.get('test@t.com');
      role![0].deactivate();
      await repository.delete(tenant1);
      const found = await repository.find(tenant1.id);
      expect(found?.tenantUserRolesMap.get('test@t.com')![0].isActive).toBeFalsy();
    });

    it('should create a new tenant and persist it', async () => {
      const id = new Id().value;
      const newTenant = new Tenant({ id, cnpj: '00000000000154' });
      await repository.create(newTenant);
      const found = await repository.find(id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(id);
    });

    it('should find an existing tenant by id', async () => {
      const found = await repository.find(tenant2.id);
      expect(found).toBeDefined();
      expect(found).toEqual(tenant2);
    });

    it('should return an empty array if no tenant has the given email', async () => {
      const results = await repository.findByEmail('noone@teste.com');

      expect(results).toEqual([]);
    });

    it('should return only tenants mapped to the given email', async () => {
      const id = new Id().value;
      const tenantA = new Tenant({ id, cnpj: '00000000000167' });
      tenantA.addTenantUserRole('user@teste.com', RoleUsersEnum.ADMINISTRATOR);
      const tenantB = new Tenant({
        id: new Id().value,
        cnpj: '00000000000168',
      });
      tenantB.addTenantUserRole('other@teste.com', RoleUsersEnum.TEACHER);

      await repository.create(tenantA);
      await repository.create(tenantB);

      const results = await repository.findByEmail('user@teste.com');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(id);
    });
  });
});
