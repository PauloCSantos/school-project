import StudentFacadeFactory from '@/modules/user-management/application/factory/student-facade.factory';

describe('User Student facade integration test', () => {
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
    paymentYear: 20000,
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
    birthday: new Date('11-12-1995'),
    email: 'teste2@test.com',
    paymentYear: 28000,
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
    birthday: new Date('11-12-1995'),
    email: 'teste2@test.com',
    paymentYear: 32000,
  };

  it('should create an user Student using the facade', async () => {
    const facade = StudentFacadeFactory.create();
    const result = await facade.create(input);

    expect(result.id).toBeDefined();
  });
  it('should find an user Student using the facade', async () => {
    const facade = StudentFacadeFactory.create();
    const result = await facade.create(input);
    const userStudent = await facade.find(result);

    expect(userStudent).toBeDefined();
  });
  it('should find all users Student using the facade', async () => {
    const facade = StudentFacadeFactory.create();
    await facade.create(input);
    await facade.create(input2);
    await facade.create(input3);

    const allUsers = await facade.findAll({});
    expect(allUsers.length).toBe(3);
  });
  it('should delete an user Student using the facade', async () => {
    const facade = StudentFacadeFactory.create();
    await facade.create(input);
    const id2 = await facade.create(input2);
    await facade.create(input3);
    const result = await facade.delete({ id: id2.id });
    const allUsers = await facade.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });
  it('should update an user Student using the facade', async () => {
    const facade = StudentFacadeFactory.create();
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

    expect(result).toBeDefined();
  });
});
