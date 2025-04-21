import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CreateNote from '../../application/usecases/note/create.usecase';
import DeleteNote from '../../application/usecases/note/delete.usecase';
import FindAllNote from '../../application/usecases/note/find-all.usecase';
import FindNote from '../../application/usecases/note/find.usecase';
import UpdateNote from '../../application/usecases/note/update.usecase';
import NoteController from '../../interface/controller/note.controller';

describe('NoteController unit test', () => {
  // Mock the usecases directly
  const mockCreateNote: jest.Mocked<CreateNote> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<CreateNote>;

  const mockFindNote: jest.Mocked<FindNote> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<FindNote>;

  const mockFindAllNote: jest.Mocked<FindAllNote> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<FindAllNote>;

  const mockUpdateNote: jest.Mocked<UpdateNote> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<UpdateNote>;

  const mockDeleteNote: jest.Mocked<DeleteNote> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<DeleteNote>;

  let controller: NoteController;
  const id = new Id().value;

  // Define example input/output data with the required 'id' property
  const noteData = {
    id: id,
    evaluation: 'd97edf09-7696-4635-8de2-f729e0133412',
    note: 10,
    student: '3bcf5b68-485b-4e3b-8730-03117f01af26',
  };

  // For create, the output should match the expected interface
  const createOutput = { id: id };

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up mock implementations with the correct output formats
    mockCreateNote.execute.mockResolvedValue(createOutput);
    mockFindNote.execute.mockResolvedValue(noteData);
    mockFindAllNote.execute.mockResolvedValue([
      noteData,
      {
        ...noteData,
        id: new Id().value,
        evaluation: 'a10edf09-7696-4635-8de2-f729e0133412',
        student: '3bgf5b68-485b-4e3b-8730-03117f01af26',
      },
    ]);
    mockUpdateNote.execute.mockResolvedValue(noteData);
    mockDeleteNote.execute.mockResolvedValue({
      message: 'Operação concluída com sucesso',
    });

    controller = new NoteController(
      mockCreateNote,
      mockFindNote,
      mockFindAllNote,
      mockUpdateNote,
      mockDeleteNote
    );
  });

  it('should return a id for the new note created', async () => {
    const createInput = {
      evaluation: new Id().value,
      student: new Id().value,
      note: 10,
    };

    const result = await controller.create(createInput);

    expect(mockCreateNote.execute).toHaveBeenCalledTimes(1);
    expect(mockCreateNote.execute).toHaveBeenCalledWith(createInput);
    expect(result).toEqual(createOutput);
  });

  it('should return a note', async () => {
    const findInput = { id };
    const result = await controller.find(findInput);

    expect(mockFindNote.execute).toHaveBeenCalledTimes(1);
    expect(mockFindNote.execute).toHaveBeenCalledWith(findInput);
    expect(result).toEqual(noteData);
  });

  it('should return all notes', async () => {
    const findAllInput = {};
    const result = await controller.findAll(findAllInput);

    expect(mockFindAllNote.execute).toHaveBeenCalledTimes(1);
    expect(mockFindAllNote.execute).toHaveBeenCalledWith(findAllInput);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });

  it('should update a note', async () => {
    const updateInput = {
      id,
      note: 8,
    };
    const result = await controller.update(updateInput);

    expect(mockUpdateNote.execute).toHaveBeenCalledTimes(1);
    expect(mockUpdateNote.execute).toHaveBeenCalledWith(updateInput);
    expect(result).toEqual(noteData);
  });

  it('should delete a note', async () => {
    const deleteInput = { id };
    const result = await controller.delete(deleteInput);

    expect(mockDeleteNote.execute).toHaveBeenCalledTimes(1);
    expect(mockDeleteNote.execute).toHaveBeenCalledWith(deleteInput);
    expect(result).toEqual({ message: 'Operação concluída com sucesso' });
  });
});
