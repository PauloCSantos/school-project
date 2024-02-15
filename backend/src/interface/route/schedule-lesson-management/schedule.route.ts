import { ScheduleController } from '@/interface/controller/schedule-lesson-management/schedule.controller';
import {
  AddLessonsInputDto,
  CreateScheduleInputDto,
  RemoveLessonsInputDto,
  UpdateScheduleInputDto,
} from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class ScheduleRoute {
  constructor(
    private readonly scheduleController: ScheduleController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/schedule', (req: any, res: any) =>
      this.findAllSchedules(req, res)
    );
    this.httpGateway.post('/schedule', (req: any, res: any) =>
      this.createSchedule(req, res)
    );
    this.httpGateway.get('/schedule/:id', (req: any, res: any) =>
      this.findSchedule(req, res)
    );
    this.httpGateway.put('/schedule/:id', (req: any, res: any) =>
      this.updateSchedule(req, res)
    );
    this.httpGateway.delete('/schedule/:id', (req: any, res: any) =>
      this.deleteSchedule(req, res)
    );
    this.httpGateway.post('schedule/add', (req: any, res: any) =>
      this.addLessons(req, res)
    );
    this.httpGateway.post('schedule/remove', (req: any, res: any) =>
      this.removeLessons(req, res)
    );
  }

  private async findAllSchedules(req: any, res: any): Promise<void> {
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
  private async createSchedule(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateScheduleInputDto;
      const response = await this.scheduleController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findSchedule(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.scheduleController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateSchedule(req: any, res: any): Promise<void> {
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
  private async deleteSchedule(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.scheduleController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async addLessons(req: any, res: any): Promise<void> {
    try {
      const input = req.body as AddLessonsInputDto;
      const response = await this.scheduleController.addLessons(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async removeLessons(req: any, res: any): Promise<void> {
    try {
      const input = req.body as RemoveLessonsInputDto;
      const response = await this.scheduleController.removeLessons(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
