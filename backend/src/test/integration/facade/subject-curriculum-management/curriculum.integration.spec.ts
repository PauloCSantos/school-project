import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CurriculumFacadeFactory from '@/modules/subject-curriculum-management/application/factory/curriculum.factory';

describe('Curriculum facade integration test', () => {
  const input = {
    name: 'Math',
    subjectsList: [new Id().value, new Id().value],
    yearsToComplete: 5,
  };
  const input2 = {
    name: 'Portuguese',
    subjectsList: [new Id().value, new Id().value],
    yearsToComplete: 5,
  };
  const input3 = {
    name: 'Japanese',
    subjectsList: [new Id().value, new Id().value],
    yearsToComplete: 5,
  };
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: RoleUsersEnum.MASTER,
  };

  it('should create an Curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    const result = await facade.create(input, token);

    expect(result.id).toBeDefined();
  });
  it('should find an Curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    const result = await facade.create(input, token);
    const userCurriculum = await facade.find(result, token);

    expect(userCurriculum).toBeDefined();
  });
  it('should find all users Curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    await facade.create(input, token);
    await facade.create(input2, token);
    await facade.create(input3, token);
    const allUsers = await facade.findAll({}, token);

    expect(allUsers.length).toBe(3);
  });
  it('should delete an Curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    await facade.create(input, token);
    const id2 = await facade.create(input2, token);
    await facade.create(input3, token);
    const result = await facade.delete({ id: id2.id }, token);
    //const allUsers = await facade.findAll({}, token);

    expect(result.message).toBe('Operation completed successfully');
    //expect(allUsers.length).toBe(2);
  });
  it('should update an Curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.update(
      {
        id: id.id,
        yearsToComplete: 6,
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should add subjects to the curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.addSubjects(
      {
        id: id.id,
        newSubjectsList: [new Id().value],
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should remove subjects to the curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.removeSubjects(
      {
        id: id.id,
        subjectsListToRemove: [input.subjectsList[0]],
      },
      token
    );

    expect(result).toBeDefined();
  });
});
