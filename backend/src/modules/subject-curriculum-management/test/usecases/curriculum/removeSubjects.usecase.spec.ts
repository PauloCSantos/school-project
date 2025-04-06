import RemoveSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/removeSubjects.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addSubjects: jest.fn(),
    removeSubjects: jest.fn((_, subjectsListToRemove) =>
      Promise.resolve(
        `${subjectsListToRemove.length} ${
          subjectsListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`
      )
    ),
  };
};

describe('RemoveSubjects use case unit test', () => {
  const curriculum = new Curriculum({
    name: 'Math',
    subjectsList: [new Id().id, new Id().id],
    yearsToComplete: 5,
  });
  const input = {
    id: curriculum.id.id,
    subjectsListToRemove: [curriculum.subjectList[0]],
  };

  describe('On fail', () => {
    it('should throw an error if the curriculum is not found', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(undefined);

      const usecase = new RemoveSubjects(curriculumRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Curriculum not found'
      );
      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.removeSubjects).not.toHaveBeenCalled();
    });
    it('should throw an error if the subject is not found in the curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);

      const usecase = new RemoveSubjects(curriculumRepository);

      await expect(
        usecase.execute({ ...input, subjectsListToRemove: [new Id().id] })
      ).rejects.toThrow('This subject is not included in the curriculum');
      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.removeSubjects).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove subjects from the curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);

      const usecase = new RemoveSubjects(curriculumRepository);
      const result = await usecase.execute(input);

      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.removeSubjects).toHaveBeenCalledWith(
        input.id,
        input.subjectsListToRemove
      );
      expect(result.message).toEqual(`1 value was removed`);
    });
  });
});
