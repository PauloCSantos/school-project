import CreateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/createCurriculum.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(curriculum => Promise.resolve(curriculum.id.value)),
    update: jest.fn(),
    delete: jest.fn(),
    addSubjects: jest.fn(),
    removeSubjects: jest.fn(),
  };
};

describe('createCurriculum usecase unit test', () => {
  const input = {
    name: 'Math',
    subjectsList: [new Id().value, new Id().value, new Id().value],
    yearsToComplete: 5,
  };

  const curriculum = new Curriculum({
    name: input.name,
    subjectsList: input.subjectsList,
    yearsToComplete: input.yearsToComplete,
  });

  describe('On fail', () => {
    it('should throw an error if the curriculum already exists', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);

      const usecase = new CreateCurriculum(curriculumRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Curriculum already exists'
      );
      expect(curriculumRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(curriculumRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateCurriculum(curriculumRepository);
      const result = await usecase.execute(input);

      expect(curriculumRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(curriculumRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
