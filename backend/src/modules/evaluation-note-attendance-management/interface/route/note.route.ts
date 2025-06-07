import {
  HttpServer,
  HttpResponseData,
} from '@/modules/@shared/infraestructure/http/http.interface';
import NoteController from '../controller/note.controller';
import { validId } from '@/modules/@shared/utils/validations';
import AuthUserMiddleware, {
  AuthHttpRequest,
} from '@/modules/@shared/application/middleware/authUser.middleware';
import { AuthErrorHandlerMiddleware } from '@/modules/@shared/application/middleware/authUser.middleware';
import {
  CreateNoteInputDto,
  UpdateNoteInputDto,
  FindNoteInputDto,
  FindAllNoteInputDto,
} from '../../application/dto/note-usecase.dto';

export default class NoteRoute {
  constructor(
    private readonly noteController: NoteController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    const errorHandler = new AuthErrorHandlerMiddleware();

    this.httpGateway.get(
      '/notes',
      this.findAllNotes.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.post(
      '/note',
      this.createNote.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.get(
      '/note/:id',
      this.findNote.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.patch(
      '/note/:id',
      this.updateNote.bind(this),
      errorHandler,
      this.authMiddleware
    );

    this.httpGateway.delete(
      '/note/:id',
      this.deleteNote.bind(this),
      errorHandler,
      this.authMiddleware
    );
  }

  private async findAllNotes(
    req: AuthHttpRequest<{}, {}, FindAllNoteInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        return {
          statusCode: 400,
          body: { error: 'Quantity e/ou offset estão incorretos' },
        };
      }
      const response = await this.noteController.findAll({ quantity, offset });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createNote(
    req: AuthHttpRequest<{}, {}, CreateNoteInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        return {
          statusCode: 400,
          body: { error: 'Dados inválidos para criação de nota' },
        };
      }
      const response = await this.noteController.create(input);
      return { statusCode: 201, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findNote(
    req: AuthHttpRequest<FindNoteInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.noteController.find({ id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error, 404);
    }
  }

  private async updateNote(
    req: AuthHttpRequest<FindNoteInputDto, {}, UpdateNoteInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!validId(id)) {
        return {
          statusCode: 400,
          body: { error: 'Id e/ou dados para atualização inválidos' },
        };
      }
      const response = await this.noteController.update({ ...input, id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteNote(
    req: AuthHttpRequest<FindNoteInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      if (!validId(id)) {
        return { statusCode: 400, body: { error: 'Id inválido' } };
      }
      const response = await this.noteController.delete({ id });
      return { statusCode: 200, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private validateFindAll(quantity?: number, offset?: number): boolean {
    return (
      quantity !== undefined &&
      offset !== undefined &&
      !isNaN(quantity) &&
      !isNaN(offset)
    );
  }

  private validateCreate(input: CreateNoteInputDto): boolean {
    if (
      !input.evaluation ||
      !input.student ||
      typeof input.note !== 'number' ||
      isNaN(input.note)
    ) {
      return false;
    }
    return true;
  }

  private handleError(error: unknown, statusCode = 400): HttpResponseData {
    if (error instanceof Error) {
      return { statusCode, body: { error: error.message } };
    }
    return { statusCode: 500, body: { error: 'Erro interno do servidor' } };
  }
}
