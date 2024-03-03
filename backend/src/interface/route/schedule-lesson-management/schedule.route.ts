import { ScheduleController } from '@/interface/controller/schedule-lesson-management/schedule.controller';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { validId } from '@/util/validations';

export class ScheduleRoute {
  constructor(
    private readonly scheduleController: ScheduleController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/schedules', (req: any, res: any) =>
      this.findAllSchedules(req, res)
    );
    this.httpGateway.post('/schedule', (req: any, res: any) =>
      this.createSchedule(req, res)
    );
    this.httpGateway.get('/schedule/:id', (req: any, res: any) =>
      this.findSchedule(req, res)
    );
    this.httpGateway.patch('/schedule/:id', (req: any, res: any) =>
      this.updateSchedule(req, res)
    );
    this.httpGateway.delete('/schedule/:id', (req: any, res: any) =>
      this.deleteSchedule(req, res)
    );
    this.httpGateway.post('/schedule/add', (req: any, res: any) =>
      this.addLessons(req, res)
    );
    this.httpGateway.post('/schedule/remove', (req: any, res: any) =>
      this.removeLessons(req, res)
    );
  }

  private async findAllSchedules(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      } else {
        const response = await this.scheduleController.findAll({
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
  private async createSchedule(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.scheduleController.create(input);
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
  private async findSchedule(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.scheduleController.find({ id });
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
  private async updateSchedule(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        res.status(400).json({ error: 'Id e/ou input incorretos' });
      } else {
        input.id = id;
        const response = await this.scheduleController.update(input);
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
  private async deleteSchedule(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.scheduleController.delete({ id });
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
  private async addLessons(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validAdd(input)) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.scheduleController.addLessons(input);
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
  private async removeLessons(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validRemove(input)) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.scheduleController.removeLessons(input);
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
    const { student, curriculum, lessonsList } = input;

    if (
      student === undefined ||
      curriculum === undefined ||
      lessonsList === undefined
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
  private validAdd(input: any): boolean {
    if (!validId(input.id) || input.newLessonsList === undefined) return false;
    return true;
  }
  private validRemove(input: any): boolean {
    if (!validId(input.id) || input.lessonsListToRemove === undefined)
      return false;
    return true;
  }
}
