import { UserWorkerController } from '@/interface/controller/user-management/user-worker.controller';
import {
  CreateUserWorkerInputDto,
  UpdateUserWorkerInputDto,
} from '@/application/dto/user-management/worker-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class UserWorkerRoute {
  constructor(
    private readonly userWorkerController: UserWorkerController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/user-workers', (req: any, res: any) =>
      this.findAllUserWorkers(req, res)
    );
    this.httpGateway.post('/user-workers', (req: any, res: any) =>
      this.createUserWorker(req, res)
    );
    this.httpGateway.get('/user-workers/:id', (req: any, res: any) =>
      this.findUserWorker(req, res)
    );
    this.httpGateway.patch('/user-workers/:id', (req: any, res: any) =>
      this.updateUserWorker(req, res)
    );
    this.httpGateway.delete('/user-workers/:id', (req: any, res: any) =>
      this.deleteUserWorker(req, res)
    );
  }

  private async findAllUserWorkers(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const any = await this.userWorkerController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(any);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createUserWorker(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateUserWorkerInputDto;
      const any = await this.userWorkerController.create(input);
      res.status(201).json(any);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findUserWorker(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const any = await this.userWorkerController.find(input);
      res.status(200).json(any);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateUserWorker(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserWorkerInputDto = req.body;
      input.id = id;
      const any = await this.userWorkerController.update(input);
      res.status(200).json(any);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteUserWorker(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const any = await this.userWorkerController.delete(input);
      res.status(204).json({ any });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
