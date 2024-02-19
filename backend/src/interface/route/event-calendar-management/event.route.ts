import {
  CreateEventInputDto,
  UpdateEventInputDto,
} from '@/application/dto/event-calendar-management/event-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { EventController } from '@/interface/controller/event-calendar-management/event.controller';

export class EventRoute {
  constructor(
    private readonly userStudentController: EventController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/event', (req: any, res: any) =>
      this.findAllEvents(req, res)
    );
    this.httpGateway.post('/event', (req: any, res: any) =>
      this.createEvent(req, res)
    );
    this.httpGateway.get('/event/:id', (req: any, res: any) =>
      this.findEvent(req, res)
    );
    this.httpGateway.patch('/event/:id', (req: any, res: any) =>
      this.updateEvent(req, res)
    );
    this.httpGateway.delete('/event/:id', (req: any, res: any) =>
      this.deleteEvent(req, res)
    );
  }

  private async findAllEvents(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.userStudentController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
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
      const input = req.body as CreateEventInputDto;
      const response = await this.userStudentController.create({
        ...input,
        date: new Date(input.date),
      });
      res.status(201).json(response);
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
      const input = { id };
      const response = await this.userStudentController.find(input);
      res.status(200).json(response);
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
      const input: UpdateEventInputDto = req.body;
      input.id = id;
      const response = await this.userStudentController.update(input);
      res.status(200).json(response);
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
      const input = { id };
      const response = await this.userStudentController.delete(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
}
