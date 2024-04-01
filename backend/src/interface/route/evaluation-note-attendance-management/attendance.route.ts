import { AttendanceController } from '@/interface/controller/evaluation-note-attendance-management/attendance.controller';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { validId } from '@/util/validations';
import AuthUserMiddleware from '@/application/middleware/authUser.middleware';

export class AttendanceRoute {
  constructor(
    private readonly attendanceController: AttendanceController,
    private readonly httpGateway: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.httpGateway.get('/attendances', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.findAllAttendances(req, res)
      );
    });
    this.httpGateway.post('/attendance', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.createAttendance(req, res)
      );
    });
    this.httpGateway.get('/attendance/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findAttendance(req, res));
    });
    this.httpGateway.patch('/attendance/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.updateAttendance(req, res)
      );
    });
    this.httpGateway.delete('/attendance/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.deleteAttendance(req, res)
      );
    });
    this.httpGateway.post('/attendance/add/students', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.addStudents(req, res));
    });
    this.httpGateway.post(
      '/attendance/remove/students',
      (req: any, res: any) => {
        this.authMiddleware.handle(req, res, () =>
          this.removeStudents(req, res)
        );
      }
    );
  }

  private async findAllAttendances(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      } else {
        const response = await this.attendanceController.findAll({
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
  private async createAttendance(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.attendanceController.create({
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
  private async findAttendance(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.attendanceController.find({ id });
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
  private async updateAttendance(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        res.status(400).json({ error: 'Id e/ou input incorretos' });
      } else {
        input.id = id;
        input.date ? (input.date = new Date(input.date)) : undefined;
        const response = await this.attendanceController.update(input);
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
  private async deleteAttendance(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.attendanceController.delete({ id });
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
      if (!this.validAdd(input)) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.attendanceController.addStudents(input);
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
      if (!this.validRemove(input)) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.attendanceController.removeStudents(input);
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
    const { date, day, hour, lesson, studentsPresent } = input;

    if (
      date === undefined ||
      day === undefined ||
      hour === undefined ||
      lesson === undefined ||
      studentsPresent === undefined
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
    if (!validId(input.id) || input.newStudentsList === undefined) return false;
    return true;
  }
  private validRemove(input: any): boolean {
    if (!validId(input.id) || input.studentsListToRemove === undefined)
      return false;
    return true;
  }
}
