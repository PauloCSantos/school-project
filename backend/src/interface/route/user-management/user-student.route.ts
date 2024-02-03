import { Request, Response } from 'express';

import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { UserStudentController } from '@/interface/controller/user-management/user-student.controller';
import {
  CreateUserStudentInputDto,
  UpdateUserStudentInputDto,
} from '@/application/dto/user-management/student-usecase.dto';

export class UserStudentRoute {
  constructor(
    private readonly userStudentController: UserStudentController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/user-students', this.findAllUserStudents);
    this.httpGateway.post('/user-students', this.createUserStudent);
    this.httpGateway.get('/user-students/:id', this.findUserStudent);
    this.httpGateway.put('/user-students/:id', this.updateUserStudent);
    this.httpGateway.delete('/user-students/:id', this.deleteUserStudent);
  }

  private async findAllUserStudents(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.userStudentController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createUserStudent(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateUserStudentInputDto;
      const response = await this.userStudentController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findUserStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userStudentController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateUserStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserStudentInputDto = req.body;
      input.id = id;
      const response = await this.userStudentController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteUserStudent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userStudentController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
