import CreateSubject from '@/application/usecases/subject-curriculum-management/subject/createSubject.usecase';
import DeleteSubject from '@/application/usecases/subject-curriculum-management/subject/deleteSubject.usecase';
import FindAllSubject from '@/application/usecases/subject-curriculum-management/subject/findAllSubject.usecase';
import FindSubject from '@/application/usecases/subject-curriculum-management/subject/findSubject.usecase';
import UpdateSubject from '@/application/usecases/subject-curriculum-management/subject/updateSubject.usecase';
import { SubjectController } from '@/interface/controller/subject-curriculum-management/subject.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('SubjectController unit test', () => {
  const mockCreateSubject = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().id),
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

  const createSubject = mockCreateSubject();
  const deleteSubject = mockDeleteSubject();
  const findAllSubject = mockFindAllSubject();
  const findSubject = mockFindSubject();
  const updateSubject = mockUpdateSubject();

  const controller = new SubjectController(
    createSubject,
    findSubject,
    findAllSubject,
    updateSubject,
    deleteSubject
  );

  it('should return a id for the new subject created', async () => {
    const result = await controller.create({
      name: 'Math',
      description: 'Described subject',
    });

    expect(result.id).toBeDefined;
    expect(createSubject.execute).toHaveBeenCalled();
  });
  it('should return a subject', async () => {
    const result = await controller.find(new Id());

    expect(result).toBeDefined;
    expect(findSubject.execute).toHaveBeenCalled();
  });
  it('should return all subjects', async () => {
    const result = await controller.findAll({});

    expect(result).toBeDefined;
    expect(result.length).toBe(2);
    expect(findAllSubject.execute).toHaveBeenCalled();
  });
  it('should update a subject', async () => {
    const result = await controller.update({
      id: new Id().id,
      description: 'new description',
    });

    expect(result).toBeDefined;
    expect(updateSubject.execute).toHaveBeenCalled();
  });
  it('should delete a subject', async () => {
    const result = await controller.delete({
      id: new Id().id,
    });

    expect(result).toBeDefined;
    expect(deleteSubject.execute).toHaveBeenCalled();
  });
});
