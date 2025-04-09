import MemoryNoteRepository from '../../infrastructure/repositories/memory-repository/note.repository';
import NoteFacade from '../facade/facade/note.facade';
import CreateNote from '../usecases/note/create.usecase';
import DeleteNote from '../usecases/note/delete.usecase';
import FindAllNote from '../usecases/note/find-all.usecase';
import FindNote from '../usecases/note/find.usecase';
import UpdateNote from '../usecases/note/update.usecase';

export default class NoteFacadeFactory {
  static create(): NoteFacade {
    const repository = new MemoryNoteRepository();
    const createNote = new CreateNote(repository);
    const deleteNote = new DeleteNote(repository);
    const findAllNote = new FindAllNote(repository);
    const findNote = new FindNote(repository);
    const updateNote = new UpdateNote(repository);
    const facade = new NoteFacade({
      createNote,
      deleteNote,
      findAllNote,
      findNote,
      updateNote,
    });

    return facade;
  }
}
