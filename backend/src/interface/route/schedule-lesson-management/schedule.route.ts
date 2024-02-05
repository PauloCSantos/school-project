import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { ScheduleController } from '@/interface/controller/schedule-lesson-management/schedule.controller';
import {
  AddLessonsInputDto,
  CreateScheduleInputDto,
  RemoveLessonsInputDto,
  UpdateScheduleInputDto,
} from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';

export class ScheduleRoute {
  constructor(
    private readonly scheduleController: ScheduleController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/schedule', this.findAllSchedules);
    this.httpGateway.post('/schedule', this.createSchedule);
    this.httpGateway.get('/schedule/:id', this.findSchedule);
    this.httpGateway.put('/schedule/:id', this.updateSchedule);
    this.httpGateway.delete('/schedule/:id', this.deleteSchedule);
    this.httpGateway.post('schedule/add', this.addLessons);
    this.httpGateway.post('schedule/remove', this.removeLessons);
  }

  private async findAllSchedules(req: Request, res: Response): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.scheduleController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createSchedule(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateScheduleInputDto;
      const response = await this.scheduleController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.scheduleController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateScheduleInputDto = req.body;
      input.id = id;
      const response = await this.scheduleController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.scheduleController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async addLessons(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as AddLessonsInputDto;
      const response = await this.scheduleController.addLessons(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async removeLessons(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as RemoveLessonsInputDto;
      const response = await this.scheduleController.removeLessons(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
