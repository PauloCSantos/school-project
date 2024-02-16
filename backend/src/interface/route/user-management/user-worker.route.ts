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
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async createUserWorker(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateUserWorkerInputDto;
      const any = await this.userWorkerController.create({
        ...input,
        birthday: new Date(input.birthday),
      });
      res.status(201).json(any);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async findUserWorker(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const any = await this.userWorkerController.find(input);
      res.status(200).json(any);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async updateUserWorker(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserWorkerInputDto = req.body;
      input.id = id;
      input.birthday ? (input.birthday = new Date(input.birthday)) : undefined;
      const response = await this.userWorkerController.update(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async deleteUserWorker(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userWorkerController.delete(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
}
