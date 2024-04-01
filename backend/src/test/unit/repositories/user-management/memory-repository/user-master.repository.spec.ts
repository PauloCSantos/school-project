import MemoryUserMasterRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-master.repository';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import UserMaster from '@/modules/user-management/domain/entity/user-master.entity';

describe('MemoryUserMasterRepository unit test', () => {
  let repository: MemoryUserMasterRepository;

  const id1 = new Id();
  const id2 = new Id();
  const id3 = new Id();
  const address1 = new Address({
    street: 'Street A',
    city: 'City A',
    zip: '111111-111',
    number: 1,
    avenue: 'Avenue A',
    state: 'State A',
  });
  const address2 = new Address({
    street: 'Street B',
    city: 'City B',
    zip: '111111-222',
    number: 2,
    avenue: 'Avenue B',
    state: 'State B',
  });
  const address3 = new Address({
    street: 'Street C',
    city: 'City C',
    zip: '111111-333',
    number: 3,
    avenue: 'Avenue C',
    state: 'State C',
  });
  const name1 = new Name({
    firstName: 'John',
    middleName: 'David',
    lastName: 'Doe',
  });
  const name2 = new Name({
    firstName: 'Marie',
    lastName: 'Jane',
  });
  const name3 = new Name({
    firstName: 'Carlos',
    middleName: 'Mason',
    lastName: 'June',
  });

  const birthday1 = new Date('11-12-1995');
  const birthday2 = new Date('10-04-1995');
  const birthday3 = new Date('09-01-1995');
  const cnpj1 = '12.345.678/0001-91';
  const cnpj2 = '23.456.789/0002-12';
  const cnpj3 = '34.567.891/0003-23';
  const email1 = 'teste1@test.com';
  const email2 = 'teste2@test.com';
  const email3 = 'teste3@test.com';

  const userMaster1 = new UserMaster({
    id: id1,
    name: name1,
    address: address1,
    birthday: birthday1,
    cnpj: cnpj1,
    email: email1,
  });
  const userMaster2 = new UserMaster({
    id: id2,
    name: name2,
    address: address2,
    birthday: birthday2,
    cnpj: cnpj2,
    email: email2,
  });

  beforeEach(() => {
    repository = new MemoryUserMasterRepository([userMaster1, userMaster2]);
  });

  describe('On fail', () => {
    it('should received an undefined', async () => {
      const userId = new Id().id;
      const userMasterFound = await repository.find(userId);

      expect(userMasterFound).toBeUndefined();
    });
    it('should throw an error when the Id is wrong', async () => {
      const userMaster = new UserMaster({
        id: new Id(),
        name: name3,
        address: address3,
        birthday: birthday3,
        cnpj: cnpj3,
        email: email3,
      });

      await expect(repository.update(userMaster)).rejects.toThrow(
        'User not found'
      );
    });
  });
  describe('On success', () => {
    it('should find a user master', async () => {
      const userId = userMaster1.id.id;
      const userMasterFound = await repository.find(userId);

      expect(userMasterFound).toBeDefined();
      expect(userMasterFound!.id).toBeDefined();
      expect(userMasterFound!.name).toBe(userMaster1.name);
      expect(userMasterFound!.address).toBe(userMaster1.address);
      expect(userMasterFound!.email).toBe(userMaster1.email);
      expect(userMasterFound!.cnpj).toBe(userMaster1.cnpj);
      expect(userMasterFound!.birthday).toBe(userMaster1.birthday);
    });
    it('should create a new user and return its id', async () => {
      const userMaster = new UserMaster({
        id: id3,
        name: name3,
        address: address3,
        birthday: birthday3,
        cnpj: cnpj3,
        email: email3,
      });
      const result = await repository.create(userMaster);

      expect(result).toBe(userMaster.id.id);
    });
    it('should update a user and return its new informations', async () => {
      const updatedUserMaster: UserMaster = userMaster2;
      updatedUserMaster.name.firstName = 'Jane';
      updatedUserMaster.name.middleName = 'Monza';
      updatedUserMaster.name.lastName = 'Gueda';
      updatedUserMaster.address.city = address3.city;
      updatedUserMaster.address.avenue = address3.avenue;
      updatedUserMaster.address.number = address3.number;
      updatedUserMaster.address.state = address3.state;
      updatedUserMaster.address.zip = address3.zip;
      updatedUserMaster.address.street = address3.street;

      const result = await repository.update(updatedUserMaster);

      expect(result).toEqual(updatedUserMaster);
    });
  });
});
