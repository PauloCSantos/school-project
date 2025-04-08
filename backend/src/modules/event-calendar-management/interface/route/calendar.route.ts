import { HttpInterface } from '@/modules/@shared/infraestructure/http/http.interface';
import { EventController } from '../controller/calendar.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { validId } from '@/modules/@shared/utils/validations';

export class EventRoute {
  constructor(
    private readonly userStudentController: EventController,
    private readonly httpGateway: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.httpGateway.get('/events', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findAllEvents(req, res));
    });
    this.httpGateway.post('/event', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.createEvent(req, res));
    });
    this.httpGateway.get('/event/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findEvent(req, res));
    });
    this.httpGateway.patch('/event/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.updateEvent(req, res));
    });
    this.httpGateway.delete('/event/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.deleteEvent(req, res));
    });
  }

  private async findAllEvents(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      } else {
        const response = await this.userStudentController.findAll({
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
  private async createEvent(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.userStudentController.create({
          ...input,
          date: new Date(input.date),
        });
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
  private async findEvent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.userStudentController.find({ id });
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
  private async updateEvent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        res.status(400).json({ error: 'Id e/ou input incorretos' });
      } else {
        input.id = id;
        const response = await this.userStudentController.update(input);
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
  private async deleteEvent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.userStudentController.delete({ id });
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
    const { creator, name, date, hour, day, type, place } = input;

    if (
      creator === undefined ||
      name === undefined ||
      date === undefined ||
      hour === undefined ||
      day === undefined ||
      type === undefined ||
      place === undefined
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
