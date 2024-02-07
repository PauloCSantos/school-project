import { Request, Response } from 'express';
import {
  CreateUserAdministratorInputDto,
  UpdateUserAdministratorInputDto,
} from '@/application/dto/user-management/administrator-usecase.dto';
import { UserAdministratorController } from '@/interface/controller/user-management/user-administrator.controller';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';

export class UserAdministratorRoute {
  constructor(
    private readonly userAdministratorController: UserAdministratorController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get(
      '/user-administrators',
      this.findAllUserAdministrators
    );
    this.httpGateway.post('/user-administrators', this.createUserAdministrator);
    this.httpGateway.get(
      '/user-administrators/:id',
      this.findUserAdministrator
    );
    this.httpGateway.put(
      '/user-administrators/:id',
      this.updateUserAdministrator
    );
    this.httpGateway.delete(
      '/user-administrators/:id',
      this.deleteUserAdministrator
    );
  }

  private async findAllUserAdministrators(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.userAdministratorController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createUserAdministrator(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const input = req.body as CreateUserAdministratorInputDto;
      const response = await this.userAdministratorController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findUserAdministrator(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userAdministratorController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateUserAdministrator(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserAdministratorInputDto = req.body;
      input.id = id;
      const response = await this.userAdministratorController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteUserAdministrator(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userAdministratorController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
