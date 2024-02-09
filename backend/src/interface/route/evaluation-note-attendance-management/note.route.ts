import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { NoteController } from '@/interface/controller/evaluation-note-attendance-management/note.controller';
import {
  CreateNoteInputDto,
  UpdateNoteInputDto,
} from '@/application/dto/evaluation-note-attendance-management/note-usecase.dto';

export class NoteRoute {
  constructor(
    private readonly noteController: NoteController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/note', this.findAllNotes);
    this.httpGateway.post('/note', this.createNote);
    this.httpGateway.get('/note/:id', this.findNote);
    this.httpGateway.put('/note/:id', this.updateNote);
    this.httpGateway.delete('/note/:id', this.deleteNote);
  }

  private async findAllNotes(req: Request, res: Response): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.noteController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createNote(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateNoteInputDto;
      const response = await this.noteController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.noteController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateNoteInputDto = req.body;
      input.id = id;
      const response = await this.noteController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.noteController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
