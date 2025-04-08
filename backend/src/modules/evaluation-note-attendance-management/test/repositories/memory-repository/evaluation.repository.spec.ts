import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import MemoryEvaluationRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/evaluation.repository';

describe('MemoryEvaluationRepository unit test', () => {
  let repository: MemoryEvaluationRepository;

  const teacher1 = new Id().value;
  const teacher2 = new Id().value;
  const teacher3 = new Id().value;
  const lesson1 = new Id().value;
  const lesson2 = new Id().value;
  const lesson3 = new Id().value;
  const type1 = 'test';
  const type2 = 'homework';
  const type3 = 'homework';
  const value1 = 10;
  const value2 = 5;
  const value3 = 10;

  const evaluation1 = new Evaluation({
    teacher: teacher1,
    lesson: lesson1,
    type: type1,
    value: value1,
  });
  const evaluation2 = new Evaluation({
    teacher: teacher2,
    lesson: lesson2,
    type: type2,
    value: value2,
  });
  const evaluation3 = new Evaluation({
    teacher: teacher3,
    lesson: lesson3,
    type: type3,
    value: value3,
  });

  beforeEach(() => {
    repository = new MemoryEvaluationRepository([evaluation1, evaluation2]);
  });

  describe('On fail', () => {
    it('should received an undefined', async () => {
      const evaluationId = new Id().value;
      const evaluationFound = await repository.find(evaluationId);

      expect(evaluationFound).toBeUndefined();
    });
    it('should throw an error when the Id is wrong', async () => {
      const evaluation = new Evaluation({
        id: new Id(),
        teacher: teacher3,
        lesson: lesson3,
        type: type3,
        value: value3,
      });

      await expect(repository.update(evaluation)).rejects.toThrow(
        'Evaluation not found'
      );
    });
    it('should generate an error when trying to remove the evaluation with the wrong ID', async () => {
      await expect(repository.delete(new Id().value)).rejects.toThrow(
        'Evaluation not found'
      );
    });
  });

  describe('On success', () => {
    it('should find a evaluation', async () => {
      const evaluationId = evaluation1.id.value;
      const evaluationFound = await repository.find(evaluationId);

      expect(evaluationFound).toBeDefined();
      expect(evaluationFound!.id).toBeDefined();
      expect(evaluationFound!.teacher).toBe(evaluation1.teacher);
      expect(evaluationFound!.lesson).toBe(evaluation1.lesson);
      expect(evaluationFound!.type).toBe(evaluation1.type);
      expect(evaluationFound!.value).toBe(evaluation1.value);
    });
    it('should create a new evaluation and return its id', async () => {
      const result = await repository.create(evaluation3);

      expect(result).toBe(evaluation3.id.value);
    });
    it('should update a evaluation and return its new informations', async () => {
      const updatedEvaluation: Evaluation = evaluation2;
      updatedEvaluation.teacher = new Id().value;

      const result = await repository.update(updatedEvaluation);

      expect(result).toEqual(updatedEvaluation);
    });
    it('should find all the evaluations', async () => {
      const allEvaluations = await repository.findAll();

      expect(allEvaluations.length).toBe(2);
      expect(allEvaluations[0].teacher).toBe(evaluation1.teacher);
      expect(allEvaluations[1].teacher).toBe(evaluation2.teacher);
      expect(allEvaluations[0].lesson).toBe(evaluation1.lesson);
      expect(allEvaluations[1].lesson).toBe(evaluation2.lesson);
      expect(allEvaluations[0].type).toBe(evaluation1.type);
      expect(allEvaluations[1].type).toBe(evaluation2.type);
      expect(allEvaluations[0].value).toBe(evaluation1.value);
      expect(allEvaluations[1].value).toBe(evaluation2.value);
    });
    it('should remove the evaluation', async () => {
      const response = await repository.delete(evaluation1.id.value);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
