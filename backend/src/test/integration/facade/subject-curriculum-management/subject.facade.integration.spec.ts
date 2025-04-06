import SubjectFacadeFactory from '@/modules/subject-curriculum-management/application/factory/subject-facade.factory';

describe('Subject facade integration test', () => {
  const input = {
    name: 'Math',
    description: 'Nice description',
  };
  const input2 = {
    name: 'English',
    description: 'Nice description',
  };
  const input3 = {
    name: 'Portuguese',
    description: 'Nice description',
  };

  it('should create an Subject using the facade', async () => {
    const facade = SubjectFacadeFactory.create();
    const result = await facade.create(input);

    expect(result.id).toBeDefined();
  });
  it('should find an Subject using the facade', async () => {
    const facade = SubjectFacadeFactory.create();
    const result = await facade.create(input);
    const userSubject = await facade.find(result);

    expect(userSubject).toBeDefined();
  });
  it('should find all users Subject using the facade', async () => {
    const facade = SubjectFacadeFactory.create();
    await facade.create(input);
    await facade.create(input2);
    await facade.create(input3);
    const allUsers = await facade.findAll({});

    expect(allUsers.length).toBe(3);
  });
  it('should delete an Subject using the facade', async () => {
    const facade = SubjectFacadeFactory.create();
    await facade.create(input);
    const id2 = await facade.create(input2);
    await facade.create(input3);
    const result = await facade.delete({ id: id2.id });
    const allUsers = await facade.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });
  it('should update an Subject using the facade', async () => {
    const facade = SubjectFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.update({
      id: id.id,
      description: 'New amazing description',
    });

    expect(result).toBeDefined();
  });
});
