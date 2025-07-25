import {
  HttpServer,
  HttpResponseData,
  HttpRequest,
  HttpMiddleware,
} from '@/modules/@shared/infraestructure/http/http.interface';
import NoteController from '../controller/note.controller';

import {
  CreateNoteInputDto,
  UpdateNoteInputDto,
  FindNoteInputDto,
  FindAllNoteInputDto,
  DeleteNoteInputDto,
} from '../../application/dto/note-usecase.dto';
import { createRequestMiddleware } from '@/modules/@shared/application/middleware/request.middleware';
import {
  FunctionCalledEnum,
  StatusCodeEnum,
  StatusMessageEnum,
} from '@/modules/@shared/type/sharedTypes';

export default class NoteRoute {
  constructor(
    private readonly noteController: NoteController,
    private readonly httpGateway: HttpServer,
    private readonly authMiddleware: HttpMiddleware
  ) {}

  public routes(): void {
    const REQUIRED_FIELDS_ALL = ['quantity', 'offset'];
    const REQUIRED_FIELDS = ['evaluation', 'student', 'note'];
    const REQUIRED_FIELD = ['id'];

    this.httpGateway.get('/notes', this.findAllNotes.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND_ALL, REQUIRED_FIELDS_ALL),
    ]);

    this.httpGateway.post('/note', this.createNote.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.CREATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.get('/note/:id', this.findNote.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.FIND, REQUIRED_FIELD),
    ]);

    this.httpGateway.patch('/note', this.updateNote.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.UPDATE, REQUIRED_FIELDS),
    ]);

    this.httpGateway.delete('/note/:id', this.deleteNote.bind(this), [
      this.authMiddleware,
      createRequestMiddleware(FunctionCalledEnum.DELETE, REQUIRED_FIELD),
    ]);
  }

  private async findAllNotes(
    req: HttpRequest<{}, FindAllNoteInputDto, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { quantity, offset } = req.query;
      const response = await this.noteController.findAll(
        { quantity, offset },
        req.tokenData!
      );
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async createNote(
    req: HttpRequest<{}, {}, CreateNoteInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.noteController.create(input, req.tokenData!);
      return { statusCode: StatusCodeEnum.CREATED, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async findNote(
    req: HttpRequest<FindNoteInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.noteController.find({ id }, req.tokenData!);
      if (!response) {
        return {
          statusCode: StatusCodeEnum.NOT_FOUND,
          body: { error: StatusMessageEnum.NOT_FOUND },
        };
      }
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error, 404);
    }
  }

  private async updateNote(
    req: HttpRequest<{}, {}, UpdateNoteInputDto, {}>
  ): Promise<HttpResponseData> {
    try {
      const input = req.body;
      const response = await this.noteController.update(input, req.tokenData!);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async deleteNote(
    req: HttpRequest<DeleteNoteInputDto, {}, {}, {}>
  ): Promise<HttpResponseData> {
    try {
      const { id } = req.params;
      const response = await this.noteController.delete({ id }, req.tokenData!);
      return { statusCode: StatusCodeEnum.OK, body: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown, statusCode = 400): HttpResponseData {
    if (error instanceof Error) {
      return { statusCode, body: { error: error.message } };
    }
    return { statusCode: 500, body: { error: 'Erro interno do servidor' } };
  }
}
