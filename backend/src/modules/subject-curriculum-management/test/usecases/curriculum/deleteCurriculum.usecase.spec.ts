import DeleteCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/deleteCurriculum.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
    addSubjects: jest.fn(),
    removeSubjects: jest.fn(),
  };
};

describe('deleteCurriculum usecase unit test', () => {
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
    it('should return an error if the curriculum does not exist', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteCurriculum(curriculumRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('Curriculum not found');
    });
  });
  describe('On success', () => {
    it('should delete a curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);
      const usecase = new DeleteCurriculum(curriculumRepository);
      const result = await usecase.execute({
        id: curriculum.id.value,
      });

      expect(curriculumRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
