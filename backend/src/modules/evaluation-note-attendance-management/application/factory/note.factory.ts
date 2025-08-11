import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import MemoryNoteRepository from '../../infrastructure/repositories/memory-repository/note.repository';
import NoteFacade from '../facade/facade/note.facade';
import CreateNote from '../usecases/note/create.usecase';
import DeleteNote from '../usecases/note/delete.usecase';
import FindAllNote from '../usecases/note/find-all.usecase';
import FindNote from '../usecases/note/find.usecase';
import UpdateNote from '../usecases/note/update.usecase';

/**
 * Factory responsible for creating NoteFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class NoteFacadeFactory {
  /**
   * Creates an instance of NoteFacade with all dependencies properly configured
   * @returns Fully configured NoteFacade instance
   */
  static create(): NoteFacade {
    // Currently using memory repository only
    // Future implementation will use environment variables to determine repository type
    const repository = new MemoryNoteRepository();
    const policiesService = new PoliciesService();

    // Create all required use cases
    const createNote = new CreateNote(repository, policiesService);
    const deleteNote = new DeleteNote(repository, policiesService);
    const findAllNote = new FindAllNote(repository, policiesService);
    const findNote = new FindNote(repository, policiesService);
    const updateNote = new UpdateNote(repository, policiesService);

    // Instantiate and return the facade with all required use cases
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
