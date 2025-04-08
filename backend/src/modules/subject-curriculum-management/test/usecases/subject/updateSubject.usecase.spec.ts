import UpdateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/updateSubject.usecase';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(subject => Promise.resolve(subject)),
    delete: jest.fn(),
  };
};

describe('updateSubject usecase unit test', () => {
  const input = {
    name: 'Japanese',
    description: 'Described subject',
  };

  const subject1 = new Subject({
    name: 'Math',
    description: 'Described subject',
  });

  describe('On fail', () => {
    it('should throw an error if the subject does not exist', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateSubject(subjectRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('Subject not found');
    });
  });
  describe('On success', () => {
    it('should update a subject', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(subject1);
      const usecase = new UpdateSubject(subjectRepository);

      const result = await usecase.execute({
        id: subject1.id.value,
        name: input.name,
      });

      expect(subjectRepository.update).toHaveBeenCalled();
      expect(subjectRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: subject1.id.value,
        name: input.name,
        description: subject1.description,
      });
    });
  });
});
