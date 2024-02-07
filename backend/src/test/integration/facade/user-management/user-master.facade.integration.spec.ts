import MasterFacadeFactory from '@/application/factory/user-management/master-facade.factory';

describe('User master facade integration test', () => {
  const input = {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: {
      street: 'Street A',
      city: 'City A',
      zip: '111111-111',
      number: 1,
      avenue: 'Avenue A',
      state: 'State A',
    },
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    cnpj: '35.741.901/0001-58',
  };

  it('should create an user Master using the facade', async () => {
    const facade = MasterFacadeFactory.create();
    const result = await facade.create(input);

    expect(result.id).toBeDefined;
  });
  it('should find an user Master using the facade', async () => {
    const facade = MasterFacadeFactory.create();
    const result = await facade.create(input);
    const userMaster = await facade.find(result);

    expect(userMaster).toBeDefined;
  });
  it('should update an user Master using the facade', async () => {
    const facade = MasterFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.update({
      id: id.id,
      address: {
        street: 'Street B',
        city: 'City B',
        zip: '111111-111',
        number: 1,
        avenue: 'Avenue B',
        state: 'State B',
      },
    });

    expect(result).toBeDefined;
  });
});
