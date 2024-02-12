import { AttendanceController } from '@/interface/controller/evaluation-note-attendance-management/attendance.controller';
import {
  AddStudentsInputDto,
  CreateAttendanceInputDto,
  RemoveStudentsInputDto,
  UpdateAttendanceInputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class AttendanceRoute {
  constructor(
    private readonly attendanceController: AttendanceController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/attendance', (req: any, res: any) =>
      this.findAllAttendances(req, res)
    );
    this.httpGateway.post('/attendance', (req: any, res: any) =>
      this.createAttendance(req, res)
    );
    this.httpGateway.get('/attendance/:id', (req: any, res: any) =>
      this.findAttendance(req, res)
    );
    this.httpGateway.patch('/attendance/:id', (req: any, res: any) =>
      this.updateAttendance(req, res)
    );
    this.httpGateway.delete('/attendance/:id', (req: any, res: any) =>
      this.deleteAttendance(req, res)
    );
    this.httpGateway.post('attendance/add/students', (req: any, res: any) =>
      this.addStudents(req, res)
    );
    this.httpGateway.post('attendance/remove/students', (req: any, res: any) =>
      this.removeStudents(req, res)
    );
  }

  private async findAllAttendances(req: any, res: any): Promise<void> {
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
  private async createAttendance(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateAttendanceInputDto;
      const response = await this.attendanceController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findAttendance(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.attendanceController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateAttendance(req: any, res: any): Promise<void> {
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
  private async deleteAttendance(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.attendanceController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async addStudents(req: any, res: any): Promise<void> {
    try {
      const input = req.body as AddStudentsInputDto;
      const response = await this.attendanceController.addStudents(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async removeStudents(req: any, res: any): Promise<void> {
    try {
      const input = req.body as RemoveStudentsInputDto;
      const response = await this.attendanceController.removeStudents(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
