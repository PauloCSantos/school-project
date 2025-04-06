import CreateCurriculum from '../../application/usecases/curriculum/createCurriculum.usecase';
import DeleteCurriculum from '../../application/usecases/curriculum/deleteCurriculum.usecase';
import FindAllCurriculum from '../../application/usecases/curriculum/findAllCurriculum.usecase';
import FindCurriculum from '../../application/usecases/curriculum/findCurriculum.usecase';
import RemoveSubjects from '../../application/usecases/curriculum/removeSubjects.usecase';
import UpdateCurriculum from '../../application/usecases/curriculum/updateCurriculum.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AddSubjects from '../../application/usecases/curriculum/addSubjects.usecase';
import { CurriculumController } from '../../interface/controller/curriculum.controller';

describe('CurriculumController unit test', () => {
  const mockCreateCurriculum = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().id),
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
          subjectsList: [new Id().id, new Id().id],
          yearsToComplete: 5,
        },
        {
          name: 'Math',
          subjectsList: [new Id().id, new Id().id],
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

  const createCurriculum = mockCreateCurriculum();
  const deleteCurriculum = mockDeleteCurriculum();
  const findAllCurriculum = mockFindAllCurriculum();
  const findCurriculum = mockFindCurriculum();
  const updateCurriculum = mockUpdateCurriculum();
  const addSubjects = mockAddSubjects();
  const removeSubjects = mockRemoveSubjects();

  const controller = new CurriculumController(
    createCurriculum,
    findCurriculum,
    findAllCurriculum,
    updateCurriculum,
    deleteCurriculum,
    addSubjects,
    removeSubjects
  );

  it('should return a id for the new curriculum created', async () => {
    const result = await controller.create({
      name: 'Software Eng',
      subjectsList: [
        '48f8e82d-ee71-4714-9b70-7bd12e6b1c13',
        'bddca5c5-2870-4ae3-b274-10821846c673',
      ],
      yearsToComplete: 5,
    });
    expect(result).toBeDefined();
    expect(createCurriculum.execute).toHaveBeenCalled();
  });
  it('should return a curriculum', async () => {
    const result = await controller.find(new Id());

    expect(result).toBeDefined();
    expect(findCurriculum.execute).toHaveBeenCalled();
  });
  it('should return all curriculums', async () => {
    const result = await controller.findAll({});

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllCurriculum.execute).toHaveBeenCalled();
  });
  it('should update a curriculum', async () => {
    const result = await controller.update({
      id: new Id().id,
      yearsToComplete: 7,
    });

    expect(result).toBeDefined();
    expect(updateCurriculum.execute).toHaveBeenCalled();
  });
  it('should delete a curriculum', async () => {
    const result = await controller.delete({
      id: new Id().id,
    });

    expect(result).toBeDefined();
    expect(deleteCurriculum.execute).toHaveBeenCalled();
  });
  it('should add a subject to the curriculum', async () => {
    const result = await controller.addSubjects({
      id: new Id().id,
      newSubjectsList: [new Id().id],
    });

    expect(result).toBeDefined();
    expect(addSubjects.execute).toHaveBeenCalled();
  });
  it('should remove a subject from the curriculum', async () => {
    const result = await controller.removeSubjects({
      id: new Id().id,
      subjectsListToRemove: [new Id().id, new Id().id],
    });

    expect(result).toBeDefined();
    expect(removeSubjects.execute).toHaveBeenCalled();
  });
});
