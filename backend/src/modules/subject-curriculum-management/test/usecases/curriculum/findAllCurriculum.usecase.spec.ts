import FindAllCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/findAllCurriculum.usecase';
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
    removeSubjects: jest.fn(),
  };
};

describe('findAllCurriculum usecase unit test', () => {
  const curriculum1 = new Curriculum({
    name: 'Software Eng',
    subjectsList: [new Id().id, new Id().id],
    yearsToComplete: 5,
  });
  const curriculum2 = new Curriculum({
    name: 'Chemistry Eng',
    subjectsList: [new Id().id, new Id().id],
    yearsToComplete: 5,
  });

  describe('On success', () => {
    it('should find all curriculums', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.findAll.mockResolvedValue([
        curriculum1,
        curriculum2,
      ]);
      const usecase = new FindAllCurriculum(curriculumRepository);

      const result = await usecase.execute({});

      expect(curriculumRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllCurriculum(curriculumRepository);

      const result = await usecase.execute({});

      expect(curriculumRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
