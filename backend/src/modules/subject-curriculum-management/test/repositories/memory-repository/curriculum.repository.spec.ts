import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import MemoryCurriculumRepository from '@/modules/subject-curriculum-management/infrastructure/repositories/memory-repository/curriculum.repository';

describe('MemoryCurriculumRepository unit test', () => {
  let repository: MemoryCurriculumRepository;

  const name1 = 'Software Engineering';
  const name2 = 'Medicine School';
  const name3 = 'Chemistry';
  const yearsToComplete1 = 5;
  const yearsToComplete2 = 6;
  const yearsToComplete3 = 4;
  const subjectsList1 = [new Id().value, new Id().value, new Id().value];
  const subjectsList2 = [new Id().value, new Id().value, new Id().value];
  const subjectsList3 = [new Id().value, new Id().value, new Id().value];

  const curriculum1 = new Curriculum({
    name: name1,
    yearsToComplete: yearsToComplete1,
    subjectsList: subjectsList1,
  });
  const curriculum2 = new Curriculum({
    name: name2,
    yearsToComplete: yearsToComplete2,
    subjectsList: subjectsList2,
  });
  const curriculum3 = new Curriculum({
    name: name3,
    yearsToComplete: yearsToComplete3,
    subjectsList: subjectsList3,
  });

  beforeEach(() => {
    repository = new MemoryCurriculumRepository([curriculum1, curriculum2]);
  });

  describe('On fail', () => {
    it('should received an null', async () => {
      const curriculumId = new Id().value;
      const curriculumFound = await repository.find(curriculumId);

      expect(curriculumFound).toBeNull();
    });
    it('should throw an error when the Id is wrong', async () => {
      const curriculum = new Curriculum({
        id: new Id(),
        name: name3,
        yearsToComplete: yearsToComplete3,
        subjectsList: subjectsList3,
      });

      await expect(repository.update(curriculum)).rejects.toThrow(
        'Curriculum not found'
      );
    });
    it('should generate an error when trying to remove the curriculum with the wrong ID', async () => {
      await expect(repository.delete(new Id().value)).rejects.toThrow(
        'Curriculum not found'
      );
    });
    it('should generate an error when trying to remove the subject from curriculum with the wrong curriculum ID', async () => {
      await expect(
        repository.removeSubjects(new Id().value, [new Id().value])
      ).rejects.toThrow('Curriculum not found');
    });
    it('should generate an error when trying to remove the subject from curriculum with the wrong subject ID', async () => {
      await expect(
        repository.removeSubjects(curriculum1.id.value, [new Id().value])
      ).rejects.toThrow('This subject is not included in the curriculum');
    });

    it('should generate an error when trying to add the subject to the curriculum with the wrong subject ID', async () => {
      await expect(
        repository.addSubjects(curriculum1.id.value, ['asdasd'])
      ).rejects.toThrow('This subject id is invalid');
    });
  });

  describe('On success', () => {
    it('should find a curriculum', async () => {
      const curriculumId = curriculum1.id.value;
      const curriculumFound = await repository.find(curriculumId);

      expect(curriculumFound).toBeDefined();
      expect(curriculumFound!.id).toBeDefined();
      expect(curriculumFound!.name).toBe(curriculum1.name);
      expect(curriculumFound!.yearsToComplete).toBe(
        curriculum1.yearsToComplete
      );
      expect(curriculumFound!.year).toBe(curriculum1.year);
    });

    it('should create a new curriculum and return its id', async () => {
      const result = await repository.create(curriculum3);

      expect(result).toBe(curriculum3.id.value);
    });
    it('should update a curriculum and return its new informations', async () => {
      const updatedCurriculum: Curriculum = curriculum2;
      updatedCurriculum.name = 'Medicine Vet';

      const result = await repository.update(updatedCurriculum);

      expect(result).toEqual(updatedCurriculum);
    });
    it('should find all the curriculums', async () => {
      const allCurriculums = await repository.findAll();

      expect(allCurriculums.length).toBe(2);
      expect(allCurriculums[0].name).toBe(curriculum1.name);
      expect(allCurriculums[1].name).toBe(curriculum2.name);
      expect(allCurriculums[0].subjectList).toBe(curriculum1.subjectList);
      expect(allCurriculums[1].subjectList).toBe(curriculum2.subjectList);
    });
    it('should remove the curriculum', async () => {
      const response = await repository.delete(curriculum1.id.value);

      expect(response).toBe('Operação concluída com sucesso');
    });

    it('should add a new subject to the curriculum', async () => {
      const response = await repository.addSubjects(curriculum1.id.value, [
        new Id().value,
      ]);

      expect(response).toBe('1 value was entered');
    });
    it('should remove a subject from the curriculum', async () => {
      const response = await repository.removeSubjects(curriculum1.id.value, [
        curriculum1.subjectList[0],
      ]);

      expect(response).toBe('1 value was removed');
    });

    it('should add a new subject to the curriculum', async () => {
      const response = await repository.addSubjects(curriculum1.id.value, []);

      expect(response).toBe('0 values were entered');
    });
    it('should remove a subject from the curriculum', async () => {
      const response = await repository.removeSubjects(
        curriculum1.id.value,
        []
      );

      expect(response).toBe('0 values were removed');
    });
  });
});
