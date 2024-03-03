import { LessonController } from '@/interface/controller/schedule-lesson-management/lesson.controller';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { validId } from '@/util/validations';

export class LessonRoute {
  constructor(
    private readonly lessonController: LessonController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/lessons', (req: any, res: any) =>
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
      if (!this.validateFindAll(quantity, offset)) {
        res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      } else {
        const response = await this.lessonController.findAll({
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
  private async createLesson(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.lessonController.create(input);
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
  private async findLesson(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.lessonController.find({ id });
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
  private async updateLesson(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        res.status(400).json({ error: 'Id e/ou input incorretos' });
      } else {
        input.id = id;
        const response = await this.lessonController.update(input);
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
  private async deleteLesson(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.lessonController.delete({ id });
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
  private async addStudents(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validAdd(input, 'newStudentsList')) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.lessonController.addStudents(input);
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
  private async removeStudents(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validRemove(input, 'studentsListToRemove')) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.lessonController.removeStudents(input);
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
  private async addDay(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validAdd(input, 'newDaysList')) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.lessonController.addDay(input);
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
  private async removeDay(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validRemove(input, 'daysListToRemove')) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.lessonController.removeDay(input);
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
  private async addTime(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validAdd(input, 'newTimesList')) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.lessonController.addTime(input);
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
  private async removeTime(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validRemove(input, 'timesListToRemove')) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.lessonController.removeTime(input);
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
    const {
      name,
      duration,
      teacher,
      studentsList,
      subject,
      days,
      times,
      semester,
    } = input;

    if (
      name === undefined ||
      duration === undefined ||
      teacher === undefined ||
      studentsList === undefined ||
      subject === undefined ||
      days === undefined ||
      times === undefined ||
      semester === undefined
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
  private validAdd(input: any, objectKey: string): boolean {
    if (!validId(input.id) || input[objectKey] === undefined) return false;
    return true;
  }
  private validRemove(input: any, objectKey: string): boolean {
    if (!validId(input.id) || input[objectKey] === undefined) return false;
    return true;
  }
}
