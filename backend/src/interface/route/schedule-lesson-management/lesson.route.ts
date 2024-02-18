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
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class LessonRoute {
  constructor(
    private readonly lessonController: LessonController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/lesson', (req: any, res: any) =>
      this.findAllLessons(req, res)
    );
    this.httpGateway.post('/lesson', (req: any, res: any) =>
      this.createLesson(req, res)
    );
    this.httpGateway.get('/lesson/:id', (req: any, res: any) =>
      this.findLesson(req, res)
    );
    this.httpGateway.patch('/lesson/:id', (req: any, res: any) =>
      this.updateLesson(req, res)
    );
    this.httpGateway.delete('/lesson/:id', (req: any, res: any) =>
      this.deleteLesson(req, res)
    );
    this.httpGateway.post('/lesson/add/students', (req: any, res: any) =>
      this.addStudents(req, res)
    );
    this.httpGateway.post('/lesson/remove/students', (req: any, res: any) =>
      this.removeStudents(req, res)
    );
    this.httpGateway.post('/lesson/add/day', (req: any, res: any) =>
      this.addDay(req, res)
    );
    this.httpGateway.post('/lesson/remove/day', (req: any, res: any) =>
      this.removeDay(req, res)
    );
    this.httpGateway.post('/lesson/add/time', (req: any, res: any) =>
      this.addTime(req, res)
    );
    this.httpGateway.post('/lesson/remove/time', (req: any, res: any) =>
      this.removeTime(req, res)
    );
  }

  private async findAllLessons(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.lessonController.findAll({
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
  private async createLesson(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateLessonInputDto;
      const response = await this.lessonController.create(input);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async findLesson(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.lessonController.find(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async updateLesson(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateLessonInputDto = req.body;
      input.id = id;
      const response = await this.lessonController.update(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async deleteLesson(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.lessonController.delete(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async addStudents(req: any, res: any): Promise<void> {
    try {
      const input = req.body as AddStudentsInputDto;
      const response = await this.lessonController.addStudents(input);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async removeStudents(req: any, res: any): Promise<void> {
    try {
      const input = req.body as RemoveStudentsInputDto;
      const response = await this.lessonController.removeStudents(input);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async addDay(req: any, res: any): Promise<void> {
    try {
      const input = req.body as AddDayInputDto;
      const response = await this.lessonController.addDay(input);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async removeDay(req: any, res: any): Promise<void> {
    try {
      const input = req.body as RemoveDayInputDto;
      const response = await this.lessonController.removeDay(input);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async addTime(req: any, res: any): Promise<void> {
    try {
      const input = req.body as AddTimeInputDto;
      const response = await this.lessonController.addTime(input);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async removeTime(req: any, res: any): Promise<void> {
    try {
      const input = req.body as RemoveTimeInputDto;
      const response = await this.lessonController.removeTime(input);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
}
