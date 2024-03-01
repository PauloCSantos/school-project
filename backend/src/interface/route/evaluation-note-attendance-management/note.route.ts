import { NoteController } from '@/interface/controller/evaluation-note-attendance-management/note.controller';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { validId } from '@/util/validations';

export class NoteRoute {
  constructor(
    private readonly noteController: NoteController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/notes', (req: any, res: any) =>
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
      if (!this.validateFindAll(quantity, offset)) {
        res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      } else {
        const response = await this.noteController.findAll({
          quantity,
          offset,
        });
        res.status(200).json(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async createNote(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.noteController.create(input);
        res.status(201).json(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async findNote(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.noteController.find({ id });
        res.status(200).json(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async updateNote(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        res.status(400).json({ error: 'Id e/ou input incorretos' });
      } else {
        input.id = id;
        const response = await this.noteController.update(input);
        res.status(200).json(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async deleteNote(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.noteController.delete({ id });
        res.status(200).json(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private validateFindAll(
    quantity: number | undefined,
    offset: number | undefined
  ): boolean {
    if (
      quantity === undefined ||
      (typeof quantity === 'number' &&
        isNaN(quantity) &&
        offset === undefined) ||
      (typeof offset === 'number' && isNaN(offset))
    ) {
      return true;
    } else {
      return false;
    }
  }
  private validateCreate(input: any): boolean {
    const { evaluation, student, note } = input;

    if (
      evaluation === undefined ||
      student === undefined ||
      note === undefined
    ) {
      return false;
    } else {
      return true;
    }
  }
  private validFind(id: any): boolean {
    return validId(id);
  }
  private validUpdate(id: any, input: any): boolean {
    if (!validId(id)) return false;
    for (const value of Object.values(input)) {
      if (value !== undefined) {
        return true;
      }
    }
    return false;
  }
  private validDelete(id: any): boolean {
    return validId(id);
  }
}
