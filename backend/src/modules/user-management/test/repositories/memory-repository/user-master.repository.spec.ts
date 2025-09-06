import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';
import MemoryUserMasterRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/master.repository';

describe('MemoryUserMasterRepository unit test', () => {
  let repository: MemoryUserMasterRepository;

  const masterId = new Id().value;
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

  const userBase1 = new UserBase({
    name: name1,
    address: address1,
    birthday: birthday1,
    email: email1,
  });
  const userBase2 = new UserBase({
    name: name2,
    address: address2,
    birthday: birthday2,
    email: email2,
  });

  const userMaster1 = new UserMaster({
    id: id1.value,
    userId: userBase1.id.value,
    cnpj: cnpj1,
  });
  const userMaster2 = new UserMaster({
    id: id2.value,
    userId: userBase2.id.value,
    cnpj: cnpj2,
  });

  beforeEach(() => {
    repository = new MemoryUserMasterRepository([
      { masterId, records: [userMaster1, userMaster2] },
    ]);
  });

  describe('On fail', () => {
    it('should received an null', async () => {
      const userId = new Id().value;
      const userMasterFound = await repository.find(masterId, userId);

      expect(userMasterFound).toBeNull();
    });
    it('should throw an error when the Id is wrong', async () => {
      const userMaster = new UserMaster({
        id: new Id().value,
        userId: new Id().value,
        cnpj: cnpj3,
      });

      await expect(repository.update(masterId, userMaster)).rejects.toThrow(
        'User not found'
      );
    });
    it('should receive null when searching for a non-existent user id', async () => {
      const baseUserId = new Id().value;
      const userMasterFound = await repository.findByBaseUserId(masterId, baseUserId);

      expect(userMasterFound).toBeNull();
    });
  });
  describe('On success', () => {
    it('should find a user master', async () => {
      const userId = userMaster1.id.value;
      const userMasterFound = await repository.find(masterId, userId);

      expect(userMasterFound).toBeDefined();
      expect(userMasterFound!.id).toBeDefined();
      expect(userMasterFound!.cnpj).toStrictEqual(userMaster1.cnpj);
    });
    it('should create a new user and return its id', async () => {
      const userBase = new UserBase({
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
      });
      const userMaster = new UserMaster({
        id: id3.value,
        userId: userBase.id.value,
        cnpj: cnpj3,
      });
      const result = await repository.create(masterId, userMaster);

      expect(result).toBe(userMaster.id.value);
    });
    it('should update a user and return its new informations', async () => {
      const updatedUserMaster: UserMaster = userMaster2;
      updatedUserMaster.cnpj = cnpj3;

      const result = await repository.update(masterId, updatedUserMaster);

      expect(result).toEqual(updatedUserMaster);
    });
    it('should find a user master by the base user id', async () => {
      const baseUserId = userMaster1.userId;
      const userMaster = await repository.findByBaseUserId(masterId, baseUserId);

      expect(userMaster).toBeDefined();
      expect(userMaster!.id).toBeDefined();
      expect(userMaster!.id).toStrictEqual(userMaster1.id);
      expect(userMaster!.userId).toStrictEqual(userMaster1.userId);
      expect(userMaster!.cnpj).toStrictEqual(userMaster1.cnpj);
    });
  });
});
