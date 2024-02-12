import { NoteController } from '@/interface/controller/evaluation-note-attendance-management/note.controller';
import {
  CreateNoteInputDto,
  UpdateNoteInputDto,
} from '@/application/dto/evaluation-note-attendance-management/note-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class NoteRoute {
  constructor(
    private readonly noteController: NoteController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/note', (req: any, res: any) =>
      this.findAllNotes(req, res)
    );
    this.httpGateway.post('/note', (req: any, res: any) =>
      this.createNote(req, res)
    );
    this.httpGateway.get('/note/:id', (req: any, res: any) =>
      this.findNote(req, res)
    );
    this.httpGateway.patch('/note/:id', (req: any, res: any) =>
      this.updateNote(req, res)
    );
    this.httpGateway.delete('/note/:id', (req: any, res: any) =>
      this.deleteNote(req, res)
    );
  }

  private async findAllNotes(req: any, res: any): Promise<void> {
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
  private async createNote(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateNoteInputDto;
      const response = await this.noteController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findNote(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.noteController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateNote(req: any, res: any): Promise<void> {
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
  private async deleteNote(req: any, res: any): Promise<void> {
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
