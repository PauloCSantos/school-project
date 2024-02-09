import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import {
  CreateEventInputDto,
  UpdateEventInputDto,
} from '@/application/dto/event-calendar-management/event-usecase.dto';
import { EventController } from '@/interface/controller/event-calendar-management/event.controller';

export class EventRoute {
  constructor(
    private readonly userStudentController: EventController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/events', this.findAllEvents);
    this.httpGateway.post('/events', this.createEvent);
    this.httpGateway.get('/events/:id', this.findEvent);
    this.httpGateway.put('/events/:id', this.updateEvent);
    this.httpGateway.delete('/events/:id', this.deleteEvent);
  }

  private async findAllEvents(req: Request, res: Response): Promise<void> {
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
  private async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateEventInputDto;
      const response = await this.userStudentController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userStudentController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateEvent(req: Request, res: Response): Promise<void> {
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
  private async deleteEvent(req: Request, res: Response): Promise<void> {
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
