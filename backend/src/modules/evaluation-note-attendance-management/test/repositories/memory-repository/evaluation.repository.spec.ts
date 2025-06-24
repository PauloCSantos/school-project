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
    it('should return null if evaluation not found', async () => {
      const evaluationId = new Id().value;
      const evaluationFound = await repository.find(evaluationId);

      expect(evaluationFound).toBeNull();
    });

    it('should throw an error when trying to update a non-existent evaluation', async () => {
      const nonExistentId = new Id().value;
      const evaluation = new Evaluation({
        id: new Id(nonExistentId),
        teacher: teacher3,
        lesson: lesson3,
        type: type3,
        value: value3,
      });

      await expect(repository.update(evaluation)).rejects.toThrow(
        'Evaluation not found'
      );
    });

    it('should throw an error when trying to delete a non-existent evaluation', async () => {
      const nonExistentId = new Id().value;

      await expect(repository.delete(nonExistentId)).rejects.toThrow(
        'Evaluation not found'
      );
    });
  });

  describe('On success', () => {
    it('should find an existing evaluation by id', async () => {
      const evaluationId = evaluation1.id.value;
      const evaluationFound = await repository.find(evaluationId);

      expect(evaluationFound).toBeDefined();
      expect(evaluationFound!.id.value).toBe(evaluation1.id.value);
      expect(evaluationFound!.teacher).toBe(evaluation1.teacher);
      expect(evaluationFound!.lesson).toBe(evaluation1.lesson);
      expect(evaluationFound!.type).toBe(evaluation1.type);
      expect(evaluationFound!.value).toBe(evaluation1.value);
    });

    it('should create a new evaluation and return its id', async () => {
      const result = await repository.create(evaluation3);

      expect(result).toBe(evaluation3.id.value);

      // Verify evaluation was added to repository
      const evaluationFound = await repository.find(evaluation3.id.value);
      expect(evaluationFound).toBeDefined();
      expect(evaluationFound!.teacher).toBe(evaluation3.teacher);
      expect(evaluationFound!.lesson).toBe(evaluation3.lesson);

      // Verify repository state
      const allEvaluations = await repository.findAll();
      expect(allEvaluations.length).toBe(3);
    });

    it('should update an existing evaluation and persist changes', async () => {
      const updatedEvaluation = new Evaluation({
        id: evaluation2.id,
        teacher: new Id().value,
        lesson: lesson2,
        type: 'exam', // Changed from 'homework'
        value: 7, // Changed from 5
      });

      const result = await repository.update(updatedEvaluation);

      expect(result).toEqual(updatedEvaluation);

      // Verify changes were persisted
      const persisted = await repository.find(evaluation2.id.value);
      expect(persisted).toBeDefined();
      expect(persisted!.teacher).toBe(updatedEvaluation.teacher);
      expect(persisted!.type).toBe('exam');
      expect(persisted!.value).toBe(7);
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

    it('should delete an existing evaluation and update repository state', async () => {
      const response = await repository.delete(evaluation1.id.value);

      expect(response).toBe('Operação concluída com sucesso');

      // Verify evaluation was removed from repository
      const deletedEvaluation = await repository.find(evaluation1.id.value);
      expect(deletedEvaluation).toBeNull();

      // Verify repository state
      const allEvaluations = await repository.findAll();
      expect(allEvaluations.length).toBe(1);
      expect(allEvaluations[0].id.value).toBe(evaluation2.id.value);
    });
  });
});
