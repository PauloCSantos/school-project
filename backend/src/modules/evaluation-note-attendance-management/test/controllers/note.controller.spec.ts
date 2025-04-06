import CreateNote from '../../application/usecases/note/createNote.usecase';
import DeleteNote from '../../application/usecases/note/deleteNote.usecase';
import FindAllNote from '../../application/usecases/note/findAllNote.usecase';
import FindNote from '../../application/usecases/note/findNote.usecase';
import UpdateNote from '../../application/usecases/note/updateNote.usecase';
import { NoteController } from '../../interface/controller/note.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('NoteController unit test', () => {
  const mockCreateNote = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateNote;
  });
  const mockFindNote = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        evaluation: 'd97edf09-7696-4635-8de2-f729e0133412',
        note: 10,
        student: '3bcf5b68-485b-4e3b-8730-03117f01af26',
      }),
    } as unknown as FindNote;
  });
  const mockFindAllNote = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue([
        {
          evaluation: 'd97edf09-7696-4635-8de2-f729e0133412',
          note: 10,
          student: '3bcf5b68-485b-4e3b-8730-03117f01af26',
        },
        {
          evaluation: 'a10edf09-7696-4635-8de2-f729e0133412',
          note: 10,
          student: '3bgf5b68-485b-4e3b-8730-03117f01af26',
        },
      ]),
    } as unknown as FindAllNote;
  });
  const mockUpdateNote = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        evaluation: 'd97edf09-7696-4635-8de2-f729e0133412',
        note: 10,
        student: '3bcf5b68-485b-4e3b-8730-03117f01af26',
      }),
    } as unknown as UpdateNote;
  });
  const mockDeleteNote = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteNote;
  });

  const createNote = mockCreateNote();
  const deleteNote = mockDeleteNote();
  const findAllNote = mockFindAllNote();
  const findNote = mockFindNote();
  const updateNote = mockUpdateNote();

  const controller = new NoteController(
    createNote,
    findNote,
    findAllNote,
    updateNote,
    deleteNote
  );

  it('should return a id for the new note created', async () => {
    const result = await controller.create({
      evaluation: new Id().value,
      student: new Id().value,
      note: 10,
    });

    expect(result).toBeDefined();
    expect(createNote.execute).toHaveBeenCalled();
  });
  it('should return a note', async () => {
    const result = await controller.find(new Id());

    expect(result).toBeDefined();
    expect(findNote.execute).toHaveBeenCalled();
  });
  it('should return all notes', async () => {
    const result = await controller.findAll({});

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllNote.execute).toHaveBeenCalled();
  });
  it('should update an note', async () => {
    const result = await controller.update({
      id: new Id().value,
      note: 8,
    });

    expect(result).toBeDefined();
    expect(updateNote.execute).toHaveBeenCalled();
  });
  it('should delete an note', async () => {
    const result = await controller.delete({
      id: new Id().value,
    });

    expect(result).toBeDefined();
    expect(deleteNote.execute).toHaveBeenCalled();
  });
});
