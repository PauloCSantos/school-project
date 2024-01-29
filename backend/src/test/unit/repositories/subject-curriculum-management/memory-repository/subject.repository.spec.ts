import MemorySubjectRepository from '@/infraestructure/repositories/subject-curriculum-management/memory-repository/subject.repository';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';

describe('MemorySubjectRepository unit test', () => {
  let repository: MemorySubjectRepository;

  const name1 = 'Software I';
  const name2 = 'Medicine I';
  const name3 = 'Chemistry I';
  const description1 = 'Introduction to software';
  const description2 = 'Introduction to medicine';
  const description3 = 'Introduction to chemistry';

  const subject1 = new Subject({
    name: name1,
    description: description1,
  });
  const subject2 = new Subject({
    name: name2,
    description: description2,
  });
  const subject3 = new Subject({
    name: name3,
    description: description3,
  });

  beforeEach(() => {
    repository = new MemorySubjectRepository([subject1, subject2]);
  });

  describe('On fail', () => {
    it('should received an undefined', async () => {
      const subjectId = new Id().id;
      const subjectFound = await repository.find(subjectId);

      expect(subjectFound).toBeUndefined;
    });
    it('should throw an error when the Id is wrong', async () => {
      const subject = new Subject({
        id: new Id(),
        name: name3,
        description: description3,
      });

      await expect(repository.update(subject)).rejects.toThrow(
        'Subject not found'
      );
    });
    it('should generate an error when trying to remove the subject with the wrong ID', async () => {
      await expect(repository.delete(new Id().id)).rejects.toThrow(
        'Subject not found'
      );
    });
  });
  describe('On success', () => {
    it('should find a subject', async () => {
      const subjectId = subject1.id.id;
      const subjectFound = await repository.find(subjectId);

      expect(subjectFound).toBeDefined;
      //@ts-expect-error
      expect(subjectFound.id).toBeUndefined;
      expect(subjectFound!.name).toBe(subject1.name);
      expect(subjectFound!.description).toBe(subject1.description);
    });

    it('should create a new subject and return its id', async () => {
      const result = await repository.create(subject3);

      expect(result).toBe(subject3.id.id);
    });
    it('should update a subject and return its new informations', async () => {
      const updatedSubject: Subject = subject2;
      updatedSubject.name = 'Medicine II';
      updatedSubject.description = 'Advanced class';

      const result = await repository.update(updatedSubject);

      expect(result).toEqual(updatedSubject);
    });
    it('should find all the subjects', async () => {
      const allSubjects = await repository.findAll();

      expect(allSubjects.length).toBe(2);
      expect(allSubjects[0].name).toBe(subject1.name);
      expect(allSubjects[1].name).toBe(subject2.name);
      expect(allSubjects[0].description).toBe(subject1.description);
      expect(allSubjects[1].description).toBe(subject2.description);
    });
    it('should remove the subject', async () => {
      const response = await repository.delete(subject1.id.id);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
