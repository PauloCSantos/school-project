import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { UserMasterController } from '@/interface/controller/user-management/user-master.controller';
import {
  CreateUserMasterInputDto,
  UpdateUserMasterInputDto,
} from '@/application/dto/user-management/master-usecase.dto';

export class UserMasterRoute {
  constructor(
    private readonly userMasterController: UserMasterController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.post('/user-masters', this.createUserMaster);
    this.httpGateway.get('/user-masters/:id', this.findUserMaster);
    this.httpGateway.put('/user-masters/:id', this.updateUserMaster);
  }
  private async createUserMaster(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateUserMasterInputDto;
      const response = await this.userMasterController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findUserMaster(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userMasterController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateUserMaster(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserMasterInputDto = req.body;
      input.id = id;
      const response = await this.userMasterController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
