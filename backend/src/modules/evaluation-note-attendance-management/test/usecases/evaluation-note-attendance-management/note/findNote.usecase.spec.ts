import Id from '@/modules/@shared/domain/value-object/id.value-object';
import FindNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/findNote.usecase';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findNote usecase unit test', () => {
  const note1 = new Note({
    evaluation: new Id().id,
    student: new Id().id,
    note: 10,
  });
  describe('On success', () => {
    it('should find a note', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(note1);
      const usecase = new FindNote(noteRepository);

      const result = await usecase.execute({ id: note1.id.id });

      expect(noteRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when id is not found', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(undefined);

      const usecase = new FindNote(noteRepository);
      const result = await usecase.execute({
        id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
      });

      expect(result).toBe(undefined);
    });
  });
});
