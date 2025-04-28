import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';

describe('Evaluation unit test', () => {
  const baseEvaluationData = {
    teacher: new Id().value,
    lesson: new Id().value,
    type: 'Exam',
    value: 10,
  };

  let evaluation: Evaluation;

  beforeEach(() => {
    evaluation = new Evaluation({ ...baseEvaluationData });
  });

  describe('Failure cases', () => {
    it('should throw an error when input is missing required fields', () => {
      //@ts-expect-error
      expect(() => new Evaluation({})).toThrow(
        'All evaluation fields are mandatory'
      );
    });

    it('should throw an error when id is invalid', () => {
      expect(() => {
        new Evaluation({ ...baseEvaluationData, id: 'invalid-id' as any });
      }).toThrow('Invalid id');
    });

    it('should throw an error when teacher id is invalid', () => {
      expect(() => {
        new Evaluation({ ...baseEvaluationData, teacher: 'invalid-id' });
      }).toThrow('Teacher id is not valid');
    });

    it('should throw an error when lesson id is invalid', () => {
      expect(() => {
        new Evaluation({ ...baseEvaluationData, lesson: 'invalid-id' });
      }).toThrow('Lesson id is not valid');
    });

    it('should throw an error when type is too short', () => {
      expect(() => {
        new Evaluation({ ...baseEvaluationData, type: 'Ex' });
      }).toThrow('Type field is not valid');
    });

    it('should throw an error when type is empty', () => {
      expect(() => {
        new Evaluation({ ...baseEvaluationData, type: '' });
      }).toThrow('Type field is not valid');
    });

    it('should throw an error when type is too long', () => {
      const longType = 'X'.repeat(101);
      expect(() => {
        new Evaluation({ ...baseEvaluationData, type: longType });
      }).toThrow('Type field is not valid');
    });

    it('should throw an error when value is not numeric', () => {
      expect(() => {
        new Evaluation({ ...baseEvaluationData, value: 'ten' as any });
      }).toThrow('The value field must be numeric and between 0 and 10');
    });

    it('should throw an error when value is negative', () => {
      expect(() => {
        new Evaluation({ ...baseEvaluationData, value: -1 });
      }).toThrow('The value field must be numeric and between 0 and 10');
    });

    it('should throw an error when value is greater than 10', () => {
      expect(() => {
        new Evaluation({ ...baseEvaluationData, value: 11 });
      }).toThrow('The value field must be numeric and between 0 and 10');
    });

    it('should throw an error when setting an invalid teacher id after creation', () => {
      expect(() => {
        evaluation.teacher = 'invalid-id';
      }).toThrow('Teacher id is not valid');
    });

    it('should throw an error when setting an invalid lesson id after creation', () => {
      expect(() => {
        evaluation.lesson = 'invalid-id';
      }).toThrow('Lesson id is not valid');
    });

    it('should throw an error when setting an invalid type after creation', () => {
      expect(() => {
        evaluation.type = '';
      }).toThrow('Type field is not valid');
    });

    it('should throw an error when setting an invalid value after creation', () => {
      expect(() => {
        evaluation.value = 15;
      }).toThrow('The value field must be numeric and between 0 and 10');
    });
  });

  describe('Success cases', () => {
    it('should create a valid Evaluation instance', () => {
      expect(evaluation).toBeInstanceOf(Evaluation);
      expect(evaluation.teacher).toBe(baseEvaluationData.teacher);
      expect(evaluation.lesson).toBe(baseEvaluationData.lesson);
      expect(evaluation.type).toBe(baseEvaluationData.type);
      expect(evaluation.value).toBe(baseEvaluationData.value);
    });

    it('should create an Evaluation with a provided id', () => {
      const id = new Id();
      const evaluationWithId = new Evaluation({ ...baseEvaluationData, id });

      expect(evaluationWithId.id).toBe(id);
    });

    it('should allow updating teacher with valid id', () => {
      const newTeacherId = new Id().value;
      evaluation.teacher = newTeacherId;
      expect(evaluation.teacher).toBe(newTeacherId);
    });

    it('should allow updating lesson with valid id', () => {
      const newLessonId = new Id().value;
      evaluation.lesson = newLessonId;
      expect(evaluation.lesson).toBe(newLessonId);
    });

    it('should allow updating type with valid value', () => {
      evaluation.type = 'Quiz';
      expect(evaluation.type).toBe('Quiz');
    });

    it('should allow updating value with valid number', () => {
      evaluation.value = 8;
      expect(evaluation.value).toBe(8);
    });

    it('should allow value to be 0', () => {
      evaluation.value = 0;
      expect(evaluation.value).toBe(0);
    });

    it('should allow value to be 10', () => {
      evaluation.value = 10;
      expect(evaluation.value).toBe(10);
    });
  });
});
