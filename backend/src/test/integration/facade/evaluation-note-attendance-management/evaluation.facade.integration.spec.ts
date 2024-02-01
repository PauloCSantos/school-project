import EvaluationFacadeFactory from '@/application/factory/evaluation-note-attendance-management/evaluation-facade.factory';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('Evaluation facade integration test', () => {
  const input = {
    lesson: new Id().id,
    teacher: new Id().id,
    type: 'evaluation',
    value: 10,
  };
  const input2 = {
    lesson: new Id().id,
    teacher: new Id().id,
    type: 'evaluation',
    value: 10,
  };
  const input3 = {
    lesson: new Id().id,
    teacher: new Id().id,
    type: 'evaluation',
    value: 10,
  };

  it('should create an Evaluation using the facade', async () => {
    const facade = EvaluationFacadeFactory.create();
    const result = await facade.create(input);

    expect(result.id).toBeDefined;
  });
  it('should find an Evaluation using the facade', async () => {
    const facade = EvaluationFacadeFactory.create();
    const result = await facade.create(input);
    const Evaluation = await facade.find(result);

    expect(Evaluation).toBeDefined;
  });
  it('should find all Evaluation using the facade', async () => {
    const facade = EvaluationFacadeFactory.create();
    await facade.create(input);
    await facade.create(input2);
    await facade.create(input3);
    const alls = await facade.findAll({});

    expect(alls.length).toBe(3);
  });
  it('should delete an Evaluation using the facade', async () => {
    const facade = EvaluationFacadeFactory.create();
    await facade.create(input);
    const id2 = await facade.create(input2);
    await facade.create(input3);
    const result = await facade.delete({ id: id2.id });
    const alls = await facade.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(alls.length).toBe(2);
  });
  it('should update an  Evaluation using the facade', async () => {
    const facade = EvaluationFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.update({
      id: id.id,
      value: 9,
    });

    expect(result).toBeDefined;
  });
});
