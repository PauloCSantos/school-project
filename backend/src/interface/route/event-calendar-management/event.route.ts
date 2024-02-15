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
    this.httpGateway.get('/events', (req: any, res: any) =>
      this.findAllEvents(req, res)
    );
    this.httpGateway.post('/events', (req: any, res: any) =>
      this.createEvent(req, res)
    );
    this.httpGateway.get('/events/:id', (req: any, res: any) =>
      this.findEvent(req, res)
    );
    this.httpGateway.patch('/events/:id', (req: any, res: any) =>
      this.updateEvent(req, res)
    );
    this.httpGateway.delete('/events/:id', (req: any, res: any) =>
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
      res.status(204).json({ error });
    }
  }
  private async createEvent(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateEventInputDto;
      const response = await this.userStudentController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findEvent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userStudentController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
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
      res.status(404).json({ error });
    }
  }
  private async deleteEvent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userStudentController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
