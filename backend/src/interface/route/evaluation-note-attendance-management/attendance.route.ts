import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { AttendanceController } from '@/interface/controller/evaluation-note-attendance-management/attendance.controller';
import {
  AddStudentsInputDto,
  CreateAttendanceInputDto,
  RemoveStudentsInputDto,
  UpdateAttendanceInputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-usecase.dto';

export class AttendanceRoute {
  constructor(
    private readonly attendanceController: AttendanceController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/attendance', this.findAllAttendances);
    this.httpGateway.post('/attendance', this.createAttendance);
    this.httpGateway.get('/attendance/:id', this.findAttendance);
    this.httpGateway.put('/attendance/:id', this.updateAttendance);
    this.httpGateway.delete('/attendance/:id', this.deleteAttendance);
    this.httpGateway.post('attendance/add/students', this.addStudents);
    this.httpGateway.post('attendance/remove/students', this.removeStudents);
  }

  private async findAllAttendances(req: Request, res: Response): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.attendanceController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createAttendance(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateAttendanceInputDto;
      const response = await this.attendanceController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.attendanceController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateAttendanceInputDto = req.body;
      input.id = id;
      const response = await this.attendanceController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteAttendance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.attendanceController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async addStudents(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as AddStudentsInputDto;
      const response = await this.attendanceController.addStudents(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async removeStudents(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as RemoveStudentsInputDto;
      const response = await this.attendanceController.removeStudents(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
