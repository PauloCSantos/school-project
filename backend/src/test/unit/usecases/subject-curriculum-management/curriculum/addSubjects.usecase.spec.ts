import AddSubjects from '@/application/usecases/subject-curriculum-management/curriculum/addSubjects.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/curriculum/domain/entity/curriculum.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addSubjects: jest.fn((_, newSubjectsList) =>
      Promise.resolve(
        `${newSubjectsList.length} ${
          newSubjectsList.length === 1 ? 'value was' : 'values were'
        } entered`
      )
    ),
    removeSubjects: jest.fn(),
  };
};

describe('AddSubjects use case unit test', () => {
  const curriculum = new Curriculum({
    name: 'Math',
    subjectsList: [new Id().id, new Id().id],
    yearsToComplete: 5,
  });
  const input = {
    id: curriculum.id.id,
    newSubjectsList: [new Id().id, new Id().id, new Id().id],
  };

  describe('On fail', () => {
    it('should throw an error if the curriculum does not exist', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(undefined);

      const usecase = new AddSubjects(curriculumRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Curriculum not found'
      );
      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.addSubjects).not.toHaveBeenCalled();
    });
    it('should throw an error if the subject`s id does not exist in curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);

      const usecase = new AddSubjects(curriculumRepository);

      await expect(
        usecase.execute({
          ...input,
          newSubjectsList: [curriculum.subjectList[1]],
        })
      ).rejects.toThrow('This subject is already on the curriculum');
      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.addSubjects).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add subjects to the curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);

      const usecase = new AddSubjects(curriculumRepository);
      const result = await usecase.execute(input);

      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.addSubjects).toHaveBeenCalledWith(
        input.id,
        input.newSubjectsList
      );
      expect(result.message).toBe(`3 values were entered`);
    });
  });
});
