import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import NoteFacadeFactory from '@/modules/evaluation-note-attendance-management/application/factory/note.factory';

describe('Note facade integration test', () => {
  const input = {
    evaluation: new Id().value,
    student: new Id().value,
    note: 10,
  };
  const input2 = {
    evaluation: new Id().value,
    student: new Id().value,
    note: 10,
  };
  const input3 = {
    evaluation: new Id().value,
    student: new Id().value,
    note: 10,
  };
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: RoleUsersEnum.MASTER,
  };

  it('should create an Note using the facade', async () => {
    const facade = NoteFacadeFactory.create();
    const result = await facade.create(input, token);

    expect(result.id).toBeDefined();
  });
  it('should find an Note using the facade', async () => {
    const facade = NoteFacadeFactory.create();
    const result = await facade.create(input, token);
    const Note = await facade.find(result, token);

    expect(Note).toBeDefined();
  });
  it('should find all Note using the facade', async () => {
    const facade = NoteFacadeFactory.create();
    await facade.create(input, token);
    await facade.create(input2, token);
    await facade.create(input3, token);
    const alls = await facade.findAll({}, token);

    expect(alls.length).toBe(3);
  });
  it('should delete an Note using the facade', async () => {
    const facade = NoteFacadeFactory.create();
    await facade.create(input, token);
    const id2 = await facade.create(input2, token);
    await facade.create(input3, token);
    const result = await facade.delete({ id: id2.id }, token);
    const alls = await facade.findAll({}, token);

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(alls.length).toBe(2);
  });
  it('should update an  Note using the facade', async () => {
    const facade = NoteFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.update(
      {
        id: id.id,
        note: 4,
      },
      token
    );

    expect(result).toBeDefined();
  });
});
