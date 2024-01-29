import FindAllSubject from '@/application/usecases/subject-curriculum-management/subject/findAllSubject.usecase';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findAllSubject usecase unit test', () => {
  const subject1 = new Subject({
    name: 'Math',
    description: 'Nice description',
  });
  const subject2 = new Subject({
    name: 'English',
    description: 'Nice description',
  });

  describe('On success', () => {
    it('should find all subjects', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.findAll.mockResolvedValue([subject1, subject2]);
      const usecase = new FindAllSubject(subjectRepository);

      const result = await usecase.execute({});

      expect(subjectRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllSubject(subjectRepository);

      const result = await usecase.execute({});

      expect(subjectRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
