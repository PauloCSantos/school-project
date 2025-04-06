import UpdateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/updateCurriculum.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(curriculum => Promise.resolve(curriculum)),
    delete: jest.fn(),
    addSubjects: jest.fn(),
    removeSubjects: jest.fn(),
  };
};

describe('updateCurriculum usecase unit test', () => {
  const input = {
    name: 'Software Eng',
    yearsToComplete: 6,
  };

  const curriculum1 = new Curriculum({
    name: 'Math',
    subjectsList: [new Id().id, new Id().id],
    yearsToComplete: 5,
  });

  describe('On fail', () => {
    it('should throw an error if the curriculum does not exist', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateCurriculum(curriculumRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('Curriculum not found');
    });
  });
  describe('On success', () => {
    it('should update a curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum1);
      const usecase = new UpdateCurriculum(curriculumRepository);

      const result = await usecase.execute({
        id: curriculum1.id.id,
        name: input.name,
        yearsToComplete: input.yearsToComplete,
      });

      expect(curriculumRepository.update).toHaveBeenCalled();
      expect(curriculumRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: curriculum1.id.id,
        name: input.name,
        yearsToComplete: input.yearsToComplete,
      });
    });
  });
});
