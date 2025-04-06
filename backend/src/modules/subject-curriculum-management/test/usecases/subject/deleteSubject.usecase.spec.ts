import DeleteSubject from '@/modules/subject-curriculum-management/application/usecases/subject/deleteSubject.usecase';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
  };
};

describe('deleteSubject usecase unit test', () => {
  const input = {
    name: 'Math',
    description: 'Described subject',
  };

  const subject = new Subject({
    name: input.name,
    description: input.description,
  });

  describe('On fail', () => {
    it('should return an error if the subject does not exist', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteSubject(subjectRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('Subject not found');
    });
  });
  describe('On success', () => {
    it('should delete a subject', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(subject);
      const usecase = new DeleteSubject(subjectRepository);
      const result = await usecase.execute({
        id: subject.id.value,
      });

      expect(subjectRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
