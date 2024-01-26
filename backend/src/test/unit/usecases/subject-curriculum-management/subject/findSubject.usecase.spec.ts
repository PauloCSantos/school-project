import FindSubject from '@/application/usecases/subject-curriculum-management/subject/findSubject.usecase';
import Subject from '@/modules/subject-curriculum-management/subject/domain/entity/subject.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findSubject usecase unit test', () => {
  const subject1 = new Subject({
    name: 'Math',
    description: 'Described subject',
  });
  describe('On success', () => {
    it('should find a subject', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(subject1);
      const usecase = new FindSubject(subjectRepository);

      const result = await usecase.execute({ id: subject1.id.id });

      expect(subjectRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when id is not found', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(undefined);

      const usecase = new FindSubject(subjectRepository);
      const result = await usecase.execute({
        id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
      });

      expect(result).toBe(undefined);
    });
  });
});
