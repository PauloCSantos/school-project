import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { UserWorkerController } from '@/interface/controller/user-management/user-worker.controller';
import {
  CreateUserWorkerInputDto,
  UpdateUserWorkerInputDto,
} from '@/application/dto/user-management/worker-usecase.dto';

export class UserWorkerRoute {
  constructor(
    private readonly userWorkerController: UserWorkerController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/user-workers', this.findAllUserWorkers);
    this.httpGateway.post('/user-workers', this.createUserWorker);
    this.httpGateway.get('/user-workers/:id', this.findUserWorker);
    this.httpGateway.put('/user-workers/:id', this.updateUserWorker);
    this.httpGateway.delete('/user-workers/:id', this.deleteUserWorker);
  }

  private async findAllUserWorkers(req: Request, res: Response): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.userWorkerController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createUserWorker(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateUserWorkerInputDto;
      const response = await this.userWorkerController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findUserWorker(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userWorkerController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateUserWorker(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserWorkerInputDto = req.body;
      input.id = id;
      const response = await this.userWorkerController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteUserWorker(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userWorkerController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
