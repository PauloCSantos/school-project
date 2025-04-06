import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CurriculumFacadeFactory from '@/modules/subject-curriculum-management/application/factory/curriculum-facade.factory';

describe('Curriculum facade integration test', () => {
  const input = {
    name: 'Math',
    subjectsList: [new Id().id, new Id().id],
    yearsToComplete: 5,
  };
  const input2 = {
    name: 'Portuguese',
    subjectsList: [new Id().id, new Id().id],
    yearsToComplete: 5,
  };
  const input3 = {
    name: 'Japanese',
    subjectsList: [new Id().id, new Id().id],
    yearsToComplete: 5,
  };

  it('should create an Curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    const result = await facade.create(input);

    expect(result.id).toBeDefined();
  });
  it('should find an Curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    const result = await facade.create(input);
    const userCurriculum = await facade.find(result);

    expect(userCurriculum).toBeDefined();
  });
  it('should find all users Curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    await facade.create(input);
    await facade.create(input2);
    await facade.create(input3);
    const allUsers = await facade.findAll({});

    expect(allUsers.length).toBe(3);
  });
  it('should delete an Curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    await facade.create(input);
    const id2 = await facade.create(input2);
    await facade.create(input3);
    const result = await facade.delete({ id: id2.id });
    const allUsers = await facade.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });
  it('should update an Curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.update({
      id: id.id,
      yearsToComplete: 6,
    });

    expect(result).toBeDefined();
  });
  it('should add subjects to the curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.addSubjects({
      id: id.id,
      newSubjectsList: [new Id().id],
    });

    expect(result).toBeDefined();
  });
  it('should remove subjects to the curriculum using the facade', async () => {
    const facade = CurriculumFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.removeSubjects({
      id: id.id,
      subjectsListToRemove: [input.subjectsList[0]],
    });

    expect(result).toBeDefined();
  });
});
