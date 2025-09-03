import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import EvaluationFacadeFactory from '@/modules/evaluation-note-attendance-management/application/factory/evaluation.factory';

describe('Evaluation facade integration test', () => {
  const input = {
    lesson: new Id().value,
    teacher: new Id().value,
    type: 'evaluation',
    value: 10,
  };
  const input2 = {
    lesson: new Id().value,
    teacher: new Id().value,
    type: 'evaluation',
    value: 10,
  };
  const input3 = {
    lesson: new Id().value,
    teacher: new Id().value,
    type: 'evaluation',
    value: 10,
  };
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: RoleUsersEnum.MASTER,
  };

  it('should create an Evaluation using the facade', async () => {
    const facade = EvaluationFacadeFactory.create();
    const result = await facade.create(input, token);

    expect(result.id).toBeDefined();
  });
  it('should find an Evaluation using the facade', async () => {
    const facade = EvaluationFacadeFactory.create();
    const result = await facade.create(input, token);
    const Evaluation = await facade.find(result, token);

    expect(Evaluation).toBeDefined();
  });
  it('should find all Evaluation using the facade', async () => {
    const facade = EvaluationFacadeFactory.create();
    await facade.create(input, token);
    await facade.create(input2, token);
    await facade.create(input3, token);
    const alls = await facade.findAll({}, token);

    expect(alls.length).toBe(3);
  });
  it('should delete an Evaluation using the facade', async () => {
    const facade = EvaluationFacadeFactory.create();
    await facade.create(input, token);
    const id2 = await facade.create(input2, token);
    await facade.create(input3, token);
    const result = await facade.delete({ id: id2.id }, token);
    //const alls = await facade.findAll({}, token);

    expect(result.message).toBe('Operation completed successfully');
    //expect(alls.length).toBe(2);
  });
  it('should update an  Evaluation using the facade', async () => {
    const facade = EvaluationFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.update(
      {
        id: id.id,
        value: 9,
      },
      token
    );

    expect(result).toBeDefined();
  });
});
