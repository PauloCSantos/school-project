import CreateSubject from '../../application/usecases/subject/createSubject.usecase';
import DeleteSubject from '../../application/usecases/subject/deleteSubject.usecase';
import FindAllSubject from '../../application/usecases/subject/findAllSubject.usecase';
import FindSubject from '../../application/usecases/subject/findSubject.usecase';
import UpdateSubject from '../../application/usecases/subject/updateSubject.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { SubjectController } from '../../interface/controller/subject.controller';

describe('SubjectController unit test', () => {
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

    expect(result).toBeDefined();
    expect(createSubject.execute).toHaveBeenCalled();
  });
  it('should return a subject', async () => {
    const result = await controller.find({ id: new Id().value });

    expect(result).toBeDefined();
    expect(findSubject.execute).toHaveBeenCalled();
  });
  it('should return all subjects', async () => {
    const result = await controller.findAll({});

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllSubject.execute).toHaveBeenCalled();
  });
  it('should update a subject', async () => {
    const result = await controller.update({
      id: new Id().value,
      description: 'new description',
    });

    expect(result).toBeDefined();
    expect(updateSubject.execute).toHaveBeenCalled();
  });
  it('should delete a subject', async () => {
    const result = await controller.delete({
      id: new Id().value,
    });

    expect(result).toBeDefined();
    expect(deleteSubject.execute).toHaveBeenCalled();
  });
});
