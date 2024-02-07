import AdministratorFacadeFactory from '@/application/factory/user-management/administrator-facade.factory';

describe('User Administrator facade integration test', () => {
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
    salary: {
      salary: 5000,
    },
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    graduation: 'Math',
  };
  const input2 = {
    name: {
      firstName: 'Marie',
      lastName: 'Doe',
    },
    address: {
      street: 'Street B',
      city: 'City B',
      zip: '111111-111',
      number: 1,
      avenue: 'Bvenue B',
      state: 'State B',
    },
    salary: {
      salary: 8000,
    },
    birthday: new Date('11-12-1995'),
    email: 'teste2@test.com',
    graduation: 'Spanish',
  };
  const input3 = {
    name: {
      firstName: 'Paul',
      lastName: 'MCourtney',
    },
    address: {
      street: 'Street C',
      city: 'City C',
      zip: '111111-111',
      number: 1,
      avenue: 'Cvenue C',
      state: 'State C',
    },
    salary: {
      salary: 50000,
    },
    birthday: new Date('11-12-1995'),
    email: 'teste2@test.com',
    graduation: 'Japanese',
  };

  it('should create an user Administrator using the facade', async () => {
    const facade = AdministratorFacadeFactory.create();
    const result = await facade.create(input);

    expect(result.id).toBeDefined;
  });
  it('should find an user Administrator using the facade', async () => {
    const facade = AdministratorFacadeFactory.create();
    const result = await facade.create(input);
    const userAdministrator = await facade.find(result);

    expect(userAdministrator).toBeDefined;
  });
  it('should find all users Administrator using the facade', async () => {
    const facade = AdministratorFacadeFactory.create();
    await facade.create(input);
    await facade.create(input2);
    await facade.create(input3);
    const allUsers = await facade.findAll({});

    expect(allUsers.length).toBe(3);
  });
  it('should delete an user Administrator using the facade', async () => {
    const facade = AdministratorFacadeFactory.create();
    await facade.create(input);
    const id2 = await facade.create(input2);
    await facade.create(input3);
    const result = await facade.delete({ id: id2.id });
    const allUsers = await facade.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });
  it('should update an user Administrator using the facade', async () => {
    const facade = AdministratorFacadeFactory.create();
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
