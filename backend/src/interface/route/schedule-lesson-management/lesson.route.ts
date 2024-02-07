import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { LessonController } from '@/interface/controller/schedule-lesson-management/lesson.controller';
import {
  AddDayInputDto,
  AddStudentsInputDto,
  AddTimeInputDto,
  CreateLessonInputDto,
  RemoveDayInputDto,
  RemoveStudentsInputDto,
  RemoveTimeInputDto,
  UpdateLessonInputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';

export class LessonRoute {
  constructor(
    private readonly lessonController: LessonController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/lesson', this.findAllLessons);
    this.httpGateway.post('/lesson', this.createLesson);
    this.httpGateway.get('/lesson/:id', this.findLesson);
    this.httpGateway.put('/lesson/:id', this.updateLesson);
    this.httpGateway.delete('/lesson/:id', this.deleteLesson);
    this.httpGateway.post('lesson/add/students', this.addStudents);
    this.httpGateway.post('lesson/remove/students', this.removeStudents);
    this.httpGateway.post('lesson/add/day', this.addDay);
    this.httpGateway.post('lesson/remove/day', this.removeDay);
    this.httpGateway.post('lesson/add/time', this.addTime);
    this.httpGateway.post('lesson/remove/time', this.removeTime);
  }

  private async findAllLessons(req: Request, res: Response): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.lessonController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createLesson(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateLessonInputDto;
      const response = await this.lessonController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findLesson(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.lessonController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateLesson(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateLessonInputDto = req.body;
      input.id = id;
      const response = await this.lessonController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteLesson(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.lessonController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async addStudents(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as AddStudentsInputDto;
      const response = await this.lessonController.addStudents(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async removeStudents(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as RemoveStudentsInputDto;
      const response = await this.lessonController.removeStudents(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async addDay(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as AddDayInputDto;
      const response = await this.lessonController.addDay(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async removeDay(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as RemoveDayInputDto;
      const response = await this.lessonController.removeDay(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async addTime(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as AddTimeInputDto;
      const response = await this.lessonController.addTime(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async removeTime(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as RemoveTimeInputDto;
      const response = await this.lessonController.removeTime(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
