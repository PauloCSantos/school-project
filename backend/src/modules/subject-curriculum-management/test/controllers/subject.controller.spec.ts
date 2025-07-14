import CreateSubject from '../../application/usecases/subject/create.usecase';
import DeleteSubject from '../../application/usecases/subject/delete.usecase';
import FindAllSubject from '../../application/usecases/subject/find-all.usecase';
import FindSubject from '../../application/usecases/subject/find.usecase';
import UpdateSubject from '../../application/usecases/subject/update.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { SubjectController } from '../../interface/controller/subject.controller';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('SubjectController unit test', () => {
  let policieService: PoliciesServiceInterface;
  let token: TokenData;

  const mockCreateSubject = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateSubject;
  });
  const mockFindSubject = jest.fn(() => {
    return {
      execute: jest
        .fn()
        .mockResolvedValue({ name: 'Math', description: 'Described subject' }),
    } as unknown as FindSubject;
  });
  const mockFindAllSubject = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue([
        { name: 'Math', description: 'Described subject' },
        { name: 'Spanish', description: 'Described subject' },
      ]),
    } as unknown as FindAllSubject;
  });
  const mockUpdateSubject = jest.fn(() => {
    return {
      execute: jest
        .fn()
        .mockResolvedValue({ name: 'Math', description: 'Described subject' }),
    } as unknown as UpdateSubject;
  });
  const mockDeleteSubject = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteSubject;
  });

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });
  token = {
    email: 'caller@domain.com',
    role: 'master',
    masterId: new Id().value,
  };

  const createSubject = mockCreateSubject();
  const deleteSubject = mockDeleteSubject();
  const findAllSubject = mockFindAllSubject();
  const findSubject = mockFindSubject();
  const updateSubject = mockUpdateSubject();
  policieService = MockPolicyService();

  const controller = new SubjectController(
    createSubject,
    findSubject,
    findAllSubject,
    updateSubject,
    deleteSubject,
    policieService
  );

  it('should return a id for the new subject created', async () => {
    const result = await controller.create(
      {
        name: 'Math',
        description: 'Described subject',
      },
      token
    );

    expect(result).toBeDefined();
    expect(createSubject.execute).toHaveBeenCalled();
  });
  it('should return a subject', async () => {
    const result = await controller.find({ id: new Id().value }, token);

    expect(result).toBeDefined();
    expect(findSubject.execute).toHaveBeenCalled();
  });
  it('should return all subjects', async () => {
    const result = await controller.findAll({}, token);

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllSubject.execute).toHaveBeenCalled();
  });
  it('should update a subject', async () => {
    const result = await controller.update(
      {
        id: new Id().value,
        description: 'new description',
      },
      token
    );

    expect(result).toBeDefined();
    expect(updateSubject.execute).toHaveBeenCalled();
  });
  it('should delete a subject', async () => {
    const result = await controller.delete(
      {
        id: new Id().value,
      },
      token
    );

    expect(result).toBeDefined();
    expect(deleteSubject.execute).toHaveBeenCalled();
  });
});
