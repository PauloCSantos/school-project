import Id from '@/modules/@shared/domain/value-object/id.value-object';
import NoteFacadeFactory from '@/modules/evaluation-note-attendance-management/application/factory/note-facade.factory';

describe('Note facade integration test', () => {
  const input = {
    evaluation: new Id().id,
    student: new Id().id,
    note: 10,
  };
  const input2 = {
    evaluation: new Id().id,
    student: new Id().id,
    note: 10,
  };
  const input3 = {
    evaluation: new Id().id,
    student: new Id().id,
    note: 10,
  };

  it('should create an Note using the facade', async () => {
    const facade = NoteFacadeFactory.create();
    const result = await facade.create(input);

    expect(result.id).toBeDefined();
  });
  it('should find an Note using the facade', async () => {
    const facade = NoteFacadeFactory.create();
    const result = await facade.create(input);
    const Note = await facade.find(result);

    expect(Note).toBeDefined();
  });
  it('should find all Note using the facade', async () => {
    const facade = NoteFacadeFactory.create();
    await facade.create(input);
    await facade.create(input2);
    await facade.create(input3);
    const alls = await facade.findAll({});

    expect(alls.length).toBe(3);
  });
  it('should delete an Note using the facade', async () => {
    const facade = NoteFacadeFactory.create();
    await facade.create(input);
    const id2 = await facade.create(input2);
    await facade.create(input3);
    const result = await facade.delete({ id: id2.id });
    const alls = await facade.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(alls.length).toBe(2);
  });
  it('should update an  Note using the facade', async () => {
    const facade = NoteFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.update({
      id: id.id,
      note: 4,
    });

    expect(result).toBeDefined();
  });
});
