import CreateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/create.usecase';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(subject => Promise.resolve(subject.id.value)),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('createSubject usecase unit test', () => {
  const input = {
    name: 'Math',
    description: 'Described a subject',
  };

  const subject = new Subject({
    name: input.name,
    description: input.description,
  });

  describe('On fail', () => {
    it('should throw an error if the subject already exists', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(subject);

      const usecase = new CreateSubject(subjectRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Subject already exists'
      );
      expect(subjectRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(subjectRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a subject', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateSubject(subjectRepository);
      const result = await usecase.execute(input);

      expect(subjectRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(subjectRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
