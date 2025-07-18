import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CreateEvaluation from '../../application/usecases/evaluation/create.usecase';
import DeleteEvaluation from '../../application/usecases/evaluation/delete.usecase';
import FindAllEvaluation from '../../application/usecases/evaluation/find-all.usecase';
import FindEvaluation from '../../application/usecases/evaluation/find.usecase';
import UpdateEvaluation from '../../application/usecases/evaluation/update.usecase';
import EvaluationController from '../../interface/controller/evaluation.controller';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('EvaluationController unit test', () => {
  let policieService: PoliciesServiceInterface;
  let token: TokenData;
  // Mock the usecases directly
  const mockCreateEvaluation: jest.Mocked<CreateEvaluation> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<CreateEvaluation>;

  const mockFindEvaluation: jest.Mocked<FindEvaluation> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<FindEvaluation>;

  const mockFindAllEvaluation: jest.Mocked<FindAllEvaluation> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<FindAllEvaluation>;

  const mockUpdateEvaluation: jest.Mocked<UpdateEvaluation> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<UpdateEvaluation>;

  const mockDeleteEvaluation: jest.Mocked<DeleteEvaluation> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<DeleteEvaluation>;

  let controller: EvaluationController;
  const id = new Id().value;

  // Define example input/output data with the required 'id' property
  const evaluationData = {
    id: id,
    teacher: 'a2da4256-027b-4f92-989c-cda5bcbab9c5',
    lesson: 'ea3779d3-9cfb-46ad-a890-45be08ee271c',
    type: 'evaluation',
    value: 10,
  };

  // For create, the output should match the expected interface
  const createOutput = { id: id };
  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });
  token = {
    email: 'caller@domain.com',
    role: 'master',
    masterId: new Id().value,
  };
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up mock implementations with the correct output formats
    mockCreateEvaluation.execute.mockResolvedValue(createOutput);
    mockFindEvaluation.execute.mockResolvedValue(evaluationData);
    mockFindAllEvaluation.execute.mockResolvedValue([
      evaluationData,
      {
        ...evaluationData,
        id: new Id().value,
        teacher: 'a2daa756-027b-4f92-989c-cda5bcbab9c5',
        lesson: 'ea4479d3-9cfb-46ad-a890-45be08ee271c',
        type: 'homework',
        value: 5,
      },
    ]);
    mockUpdateEvaluation.execute.mockResolvedValue({
      ...evaluationData,
      type: 'homework',
      value: 5,
    });
    mockDeleteEvaluation.execute.mockResolvedValue({
      message: 'Operação concluída com sucesso',
    });
    policieService = MockPolicyService();

    controller = new EvaluationController(
      mockCreateEvaluation,
      mockFindEvaluation,
      mockFindAllEvaluation,
      mockUpdateEvaluation,
      mockDeleteEvaluation,
      policieService
    );
  });

  it('should return a id for the new evaluation created', async () => {
    const createInput = {
      lesson: new Id().value,
      teacher: new Id().value,
      type: 'evaluation',
      value: 10,
    };

    const result = await controller.create(createInput, token);

    expect(mockCreateEvaluation.execute).toHaveBeenCalledTimes(1);
    expect(mockCreateEvaluation.execute).toHaveBeenCalledWith(
      createInput,
      policieService,
      token
    );
    expect(result).toEqual(createOutput);
  });

  it('should return a evaluation', async () => {
    const findInput = { id };
    const result = await controller.find(findInput, token);

    expect(mockFindEvaluation.execute).toHaveBeenCalledTimes(1);
    expect(mockFindEvaluation.execute).toHaveBeenCalledWith(
      findInput,
      policieService,
      token
    );
    expect(result).toEqual(evaluationData);
  });

  it('should return all evaluations', async () => {
    const findAllInput = {};
    const result = await controller.findAll(findAllInput, token);

    expect(mockFindAllEvaluation.execute).toHaveBeenCalledTimes(1);
    expect(mockFindAllEvaluation.execute).toHaveBeenCalledWith(
      findAllInput,
      policieService,
      token
    );
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });

  it('should update an evaluation', async () => {
    const updateInput = {
      id,
      value: 7,
    };
    const result = await controller.update(updateInput, token);

    expect(mockUpdateEvaluation.execute).toHaveBeenCalledTimes(1);
    expect(mockUpdateEvaluation.execute).toHaveBeenCalledWith(
      updateInput,
      policieService,
      token
    );
    expect(result).toBeDefined();
  });

  it('should delete an evaluation', async () => {
    const deleteInput = { id };
    const result = await controller.delete(deleteInput, token);

    expect(mockDeleteEvaluation.execute).toHaveBeenCalledTimes(1);
    expect(mockDeleteEvaluation.execute).toHaveBeenCalledWith(
      deleteInput,
      policieService,
      token
    );
    expect(result).toEqual({ message: 'Operação concluída com sucesso' });
  });
});
