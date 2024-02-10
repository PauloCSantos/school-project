import { UserTeacherController } from '@/interface/controller/user-management/user-teacher.controller';
import {
  CreateUserTeacherInputDto,
  UpdateUserTeacherInputDto,
} from '@/application/dto/user-management/teacher-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class UserTeacherRoute {
  constructor(
    private readonly userTeacherController: UserTeacherController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/user-teachers', (req: any, res: any) =>
      this.findAllUserTeachers(req, res)
    );
    this.httpGateway.post('/user-teachers', (req: any, res: any) =>
      this.createUserTeacher(req, res)
    );
    this.httpGateway.get('/user-teachers/:id', (req: any, res: any) =>
      this.findUserTeacher(req, res)
    );
    this.httpGateway.put('/user-teachers/:id', (req: any, res: any) =>
      this.updateUserTeacher(req, res)
    );
    this.httpGateway.delete('/user-teachers/:id', (req: any, res: any) =>
      this.deleteUserTeacher(req, res)
    );
  }

  private async findAllUserTeachers(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const any = await this.userTeacherController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(any);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createUserTeacher(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateUserTeacherInputDto;
      const any = await this.userTeacherController.create(input);
      res.status(201).json(any);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findUserTeacher(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const any = await this.userTeacherController.find(input);
      res.status(200).json(any);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateUserTeacher(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserTeacherInputDto = req.body;
      input.id = id;
      const any = await this.userTeacherController.update(input);
      res.status(200).json(any);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteUserTeacher(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const any = await this.userTeacherController.delete(input);
      res.status(204).json({ any });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
