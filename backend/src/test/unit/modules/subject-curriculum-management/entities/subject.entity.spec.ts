import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';

describe('Subject unit test', () => {
  const validId = new Id();
  const validSubjectProps = {
    id: validId,
    name: 'Valid Subject',
    description: 'This is a valid subject description.',
  };

  describe('On fail', () => {
    it('should throw an error if mandatory fields are missing', () => {
      expect(() => {
        new Subject({
          name: '',
          description: '',
        });
      }).toThrow('Name and description are mandatory');
    });

    it('should throw an error if name validation fails', () => {
      expect(() => {
        new Subject({
          ...validSubjectProps,
          name: 'A',
        });
      }).toThrow('Field name is not valid');
    });

    it('should throw an error if description validation fails', () => {
      expect(() => {
        new Subject({
          ...validSubjectProps,
          description: 'A',
        });
      }).toThrow('Field description is not valid');
    });
  });
  describe('On success', () => {
    it('should set name and description correctly', () => {
      const subject = new Subject(validSubjectProps);
      expect(subject.name).toBe('Valid Subject');
      expect(subject.description).toBe('This is a valid subject description.');

      subject.name = 'Updated Subject';
      subject.description = 'Updated subject description.';
      expect(subject.name).toBe('Updated Subject');
      expect(subject.description).toBe('Updated subject description.');
    });
  });
});
