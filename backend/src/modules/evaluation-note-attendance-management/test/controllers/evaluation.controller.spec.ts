import CreateEvaluation from '../../application/usecases/evaluation/createEvaluation.usecase';
import DeleteEvaluation from '../../application/usecases/evaluation/deleteEvaluation.usecase';
import FindAllEvaluation from '../../application/usecases/evaluation/findAllEvaluation.usecase';
import FindEvaluation from '../../application/usecases/evaluation/findEvaluation.usecase';
import UpdateEvaluation from '../../application/usecases/evaluation/updateEvaluation.usecase';
import { EvaluationController } from '../../interface/controller/evaluation.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('EvaluationController unit test', () => {
  const mockCreateEvaluation = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().id),
    } as unknown as CreateEvaluation;
  });
  const mockFindEvaluation = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        teacher: 'a2da4256-027b-4f92-989c-cda5bcbab9c5',
        lesson: 'ea3779d3-9cfb-46ad-a890-45be08ee271c',
        type: 'evaluation',
        value: 10,
      }),
    } as unknown as FindEvaluation;
  });
  const mockFindAllEvaluation = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue([
        {
          teacher: 'a2da4256-027b-4f92-989c-cda5bcbab9c5',
          lesson: 'ea3779d3-9cfb-46ad-a890-45be08ee271c',
          type: 'evaluation',
          value: 10,
        },
        {
          teacher: 'a2daa756-027b-4f92-989c-cda5bcbab9c5',
          lesson: 'ea4479d3-9cfb-46ad-a890-45be08ee271c',
          type: 'homework',
          value: 5,
        },
      ]),
    } as unknown as FindAllEvaluation;
  });
  const mockUpdateEvaluation = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        teacher: 'a2daa756-027b-4f92-989c-cda5bcbab9c5',
        lesson: 'ea4479d3-9cfb-46ad-a890-45be08ee271c',
        type: 'homework',
        value: 5,
      }),
    } as unknown as UpdateEvaluation;
  });
  const mockDeleteEvaluation = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteEvaluation;
  });

  const createEvaluation = mockCreateEvaluation();
  const deleteEvaluation = mockDeleteEvaluation();
  const findAllEvaluation = mockFindAllEvaluation();
  const findEvaluation = mockFindEvaluation();
  const updateEvaluation = mockUpdateEvaluation();

  const controller = new EvaluationController(
    createEvaluation,
    findEvaluation,
    findAllEvaluation,
    updateEvaluation,
    deleteEvaluation
  );

  it('should return a id for the new evaluation created', async () => {
    const result = await controller.create({
      lesson: new Id().id,
      teacher: new Id().id,
      type: 'evaluation',
      value: 10,
    });

    expect(result).toBeDefined();
    expect(createEvaluation.execute).toHaveBeenCalled();
  });
  it('should return a evaluation', async () => {
    const result = await controller.find(new Id());

    expect(result).toBeDefined();
    expect(findEvaluation.execute).toHaveBeenCalled();
  });
  it('should return all evaluations', async () => {
    const result = await controller.findAll({});

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllEvaluation.execute).toHaveBeenCalled();
  });
  it('should update an evaluation', async () => {
    const result = await controller.update({
      id: new Id().id,
      value: 7,
    });

    expect(result).toBeDefined();
    expect(updateEvaluation.execute).toHaveBeenCalled();
  });
  it('should delete an evaluation', async () => {
    const result = await controller.delete({
      id: new Id().id,
    });

    expect(result).toBeDefined();
    expect(deleteEvaluation.execute).toHaveBeenCalled();
  });
});
