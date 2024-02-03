import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { UserTeacherController } from '@/interface/controller/user-management/user-teacher.controller';
import {
  CreateUserTeacherInputDto,
  UpdateUserTeacherInputDto,
} from '@/application/dto/user-management/teacher-usecase.dto';

export class UserTeacherRoute {
  constructor(
    private readonly userTeacherController: UserTeacherController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/user-teachers', this.findAllUserTeachers);
    this.httpGateway.post('/user-teachers', this.createUserTeacher);
    this.httpGateway.get('/user-teachers/:id', this.findUserTeacher);
    this.httpGateway.put('/user-teachers/:id', this.updateUserTeacher);
    this.httpGateway.delete('/user-teachers/:id', this.deleteUserTeacher);
  }

  private async findAllUserTeachers(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.userTeacherController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createUserTeacher(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateUserTeacherInputDto;
      const response = await this.userTeacherController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findUserTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userTeacherController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateUserTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserTeacherInputDto = req.body;
      input.id = id;
      const response = await this.userTeacherController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteUserTeacher(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userTeacherController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
