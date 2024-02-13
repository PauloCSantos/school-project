import { UserStudentController } from '@/interface/controller/user-management/user-student.controller';
import {
  CreateUserStudentInputDto,
  UpdateUserStudentInputDto,
} from '@/application/dto/user-management/student-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class UserStudentRoute {
  constructor(
    private readonly userStudentController: UserStudentController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/user-students', (req: any, res: any) =>
      this.findAllUserStudents(req, res)
    );
    this.httpGateway.post('/user-students', (req: any, res: any) =>
      this.createUserStudent(req, res)
    );
    this.httpGateway.get('/user-students/:id', (req: any, res: any) =>
      this.findUserStudent(req, res)
    );
    this.httpGateway.patch('/user-students/:id', (req: any, res: any) =>
      this.updateUserStudent(req, res)
    );
    this.httpGateway.delete('/user-students/:id', (req: any, res: any) =>
      this.deleteUserStudent(req, res)
    );
  }

  private async findAllUserStudents(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const any = await this.userStudentController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(any);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createUserStudent(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateUserStudentInputDto;
      const any = await this.userStudentController.create(input);
      res.status(201).json(any);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findUserStudent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const any = await this.userStudentController.find(input);
      res.status(200).json(any);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateUserStudent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserStudentInputDto = req.body;
      input.id = id;
      const any = await this.userStudentController.update(input);
      res.status(200).json(any);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteUserStudent(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const any = await this.userStudentController.delete(input);
      res.status(204).json({ any });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
