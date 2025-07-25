import CreateCurriculum from '../../application/usecases/curriculum/create.usecase';
import DeleteCurriculum from '../../application/usecases/curriculum/delete.usecase';
import FindAllCurriculum from '../../application/usecases/curriculum/find-all.usecase';
import FindCurriculum from '../../application/usecases/curriculum/find.usecase';
import RemoveSubjects from '../../application/usecases/curriculum/remove-subjects.usecase';
import UpdateCurriculum from '../../application/usecases/curriculum/update.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AddSubjects from '../../application/usecases/curriculum/add-subjects.usecase';
import { CurriculumController } from '../../interface/controller/curriculum.controller';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('CurriculumController unit test', () => {
  let policieService: PoliciesServiceInterface;
  let token: TokenData;

  const mockCreateCurriculum = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateCurriculum;
  });
  const mockFindCurriculum = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        name: 'Software Eng',
        subjectsList: [
          '48f8e82d-ee71-4714-9b70-7bd12e6b1c13',
          'bddca5c5-2870-4ae3-b274-10821846c673',
        ],
        yearsToComplete: 5,
      }),
    } as unknown as FindCurriculum;
  });
  const mockFindAllCurriculum = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue([
        {
          name: 'Software Eng',
          subjectsList: [new Id().value, new Id().value],
          yearsToComplete: 5,
        },
        {
          name: 'Math',
          subjectsList: [new Id().value, new Id().value],
          yearsToComplete: 5,
        },
      ]),
    } as unknown as FindAllCurriculum;
  });
  const mockUpdateCurriculum = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        name: 'Math',
        yearsToComplete: 5,
      }),
    } as unknown as UpdateCurriculum;
  });
  const mockDeleteCurriculum = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteCurriculum;
  });
  const mockAddSubjects = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({ message: '1 value was entered' }),
    } as unknown as AddSubjects;
  });
  const mockRemoveSubjects = jest.fn(() => {
    return {
      execute: jest
        .fn()
        .mockResolvedValue({ message: '2 values were removed' }),
    } as unknown as RemoveSubjects;
  });
  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });
  token = {
    email: 'caller@domain.com',
    role: 'master',
    masterId: new Id().value,
  };

  const createCurriculum = mockCreateCurriculum();
  const deleteCurriculum = mockDeleteCurriculum();
  const findAllCurriculum = mockFindAllCurriculum();
  const findCurriculum = mockFindCurriculum();
  const updateCurriculum = mockUpdateCurriculum();
  const addSubjects = mockAddSubjects();
  const removeSubjects = mockRemoveSubjects();
  policieService = MockPolicyService();

  const controller = new CurriculumController(
    createCurriculum,
    findCurriculum,
    findAllCurriculum,
    updateCurriculum,
    deleteCurriculum,
    addSubjects,
    removeSubjects,
    policieService
  );

  it('should return a id for the new curriculum created', async () => {
    const result = await controller.create(
      {
        name: 'Software Eng',
        subjectsList: [
          '48f8e82d-ee71-4714-9b70-7bd12e6b1c13',
          'bddca5c5-2870-4ae3-b274-10821846c673',
        ],
        yearsToComplete: 5,
      },
      token
    );
    expect(result).toBeDefined();
    expect(createCurriculum.execute).toHaveBeenCalled();
  });
  it('should return a curriculum', async () => {
    const result = await controller.find({ id: new Id().value }, token);

    expect(result).toBeDefined();
    expect(findCurriculum.execute).toHaveBeenCalled();
  });
  it('should return all curriculums', async () => {
    const result = await controller.findAll({}, token);

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllCurriculum.execute).toHaveBeenCalled();
  });
  it('should update a curriculum', async () => {
    const result = await controller.update(
      {
        id: new Id().value,
        yearsToComplete: 7,
      },
      token
    );

    expect(result).toBeDefined();
    expect(updateCurriculum.execute).toHaveBeenCalled();
  });
  it('should delete a curriculum', async () => {
    const result = await controller.delete(
      {
        id: new Id().value,
      },
      token
    );

    expect(result).toBeDefined();
    expect(deleteCurriculum.execute).toHaveBeenCalled();
  });
  it('should add a subject to the curriculum', async () => {
    const result = await controller.addSubjects(
      {
        id: new Id().value,
        newSubjectsList: [new Id().value],
      },
      token
    );

    expect(result).toBeDefined();
    expect(addSubjects.execute).toHaveBeenCalled();
  });
  it('should remove a subject from the curriculum', async () => {
    const result = await controller.removeSubjects(
      {
        id: new Id().value,
        subjectsListToRemove: [new Id().value, new Id().value],
      },
      token
    );

    expect(result).toBeDefined();
    expect(removeSubjects.execute).toHaveBeenCalled();
  });
});
