import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';

describe('Evaluation unit test', () => {
  const evaluationData = {
    teacher: new Id().value,
    lesson: new Id().value,
    type: 'Exame',
    value: 10,
  };

  describe('On fail', () => {
    it('should throw error when the input have missing values', () => {
      expect(() => {
        //@ts-expect-error
        new Evaluation({});
      }).toThrow('All evalutation fields are mandatory');
    });
    it('Error when setting invalid type', () => {
      const evaluationInstance = new Evaluation(evaluationData);

      expect(() => {
        evaluationInstance.type = '';
      }).toThrow('Type field is not valid');
    });
    it('Error when setting invalid value', () => {
      const evaluationInstance = new Evaluation(evaluationData);

      expect(() => {
        evaluationInstance.value = 80;
      }).toThrow('The value field must be numeric and between 0 and 10');
    });
  });
  describe('On success', () => {
    it('Create a valid evaluation', () => {
      const evaluationInstance = new Evaluation(evaluationData);
      expect(evaluationInstance).toBeInstanceOf(Evaluation);
      expect(evaluationInstance.id).toBeDefined();
      expect(evaluationInstance.teacher).toBe(evaluationData.teacher);
      expect(evaluationInstance.type).toBe(evaluationData.type);
      expect(evaluationInstance.lesson).toBe(evaluationData.lesson);
      expect(evaluationInstance.value).toBe(evaluationData.value);
    });
  });
});
