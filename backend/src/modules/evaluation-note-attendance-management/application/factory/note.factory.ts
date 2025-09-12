import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import NoteFacade from '../facade/facade/note.facade';
import CreateNote from '../usecases/note/create.usecase';
import DeleteNote from '../usecases/note/delete.usecase';
import FindAllNote from '../usecases/note/find-all.usecase';
import FindNote from '../usecases/note/find.usecase';
import UpdateNote from '../usecases/note/update.usecase';
import NoteGateway from '../gateway/note.gateway';

/**
 * Factory responsible for creating NoteFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class NoteFacadeFactory {
  /**
   * Creates an instance of NoteFacade with all dependencies properly configured
   * @returns Fully configured NoteFacade instance
   */
  static create(
    repository: NoteGateway,
    policiesService: PoliciesServiceInterface
  ): NoteFacade {
    const createNote = new CreateNote(repository, policiesService);
    const deleteNote = new DeleteNote(repository, policiesService);
    const findAllNote = new FindAllNote(repository, policiesService);
    const findNote = new FindNote(repository, policiesService);
    const updateNote = new UpdateNote(repository, policiesService);

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
