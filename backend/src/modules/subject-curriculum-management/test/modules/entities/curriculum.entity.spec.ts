import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';

describe('Curriculum unit test', () => {
  const validId = new Id();
  const id1 = new Id();
  const id2 = new Id();
  const id3 = new Id();
  const validCurriculumProps = {
    id: validId,
    name: 'Valid Curriculum',
    yearsToComplete: 5,
    subjectsList: [id1.value, id2.value, id3.value],
  };

  describe('On fail', () => {
    it('should throw an error if mandatory fields are missing', () => {
      expect(() => {
        //@ts-expect-error
        new Curriculum({
          yearsToComplete: 0,
          subjectsList: [],
        });
      }).toThrow('All curriculum fields are mandatory');
    });
    it('should throw an error if name validation fails', () => {
      expect(() => {
        new Curriculum({
          ...validCurriculumProps,
          name: 'A',
        });
      }).toThrow('Field name is not valid');
    });
    it('should throw an error if yearsToComplete validation fails', () => {
      expect(() => {
        new Curriculum({
          ...validCurriculumProps,
          yearsToComplete: 0,
        });
      }).toThrow('Field date is not valid');
    });
    it('should throw an error if subject validation fails', () => {
      expect(() => {
        new Curriculum({
          ...validCurriculumProps,
          subjectsList: [
            'InvalidSubject1',
            'InvalidSubject2',
            'InvalidSubject1',
          ],
        });
      }).toThrow('Subject IDs do not match pattern');
    });
  });
  describe('On success', () => {
    it('should add and remove subjects correctly', () => {
      const curriculum = new Curriculum(validCurriculumProps);
      expect(curriculum.subjectList).toEqual([id1.value, id2.value, id3.value]);
      const newId = new Id();
      curriculum.addSubject(newId.value);
      expect(curriculum.subjectList).toEqual([
        id1.value,
        id2.value,
        id3.value,
        newId.value,
      ]);

      curriculum.removeSubject(id2.value);
      expect(curriculum.subjectList).toEqual([
        id1.value,
        id3.value,
        newId.value,
      ]);
    });
  });
});
