import { UserMasterController } from '@/interface/controller/user-management/user-master.controller';
import {
  CreateUserMasterInputDto,
  UpdateUserMasterInputDto,
} from '@/application/dto/user-management/master-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class UserMasterRoute {
  constructor(
    private readonly userMasterController: UserMasterController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.post('/user-masters', (req: any, res: any) =>
      this.createUserMaster(req, res)
    );
    this.httpGateway.get('/user-masters/:id', (req: any, res: any) =>
      this.findUserMaster(req, res)
    );
    this.httpGateway.patch('/user-masters/:id', (req: any, res: any) =>
      this.updateUserMaster(req, res)
    );
  }

  private async createUserMaster(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateUserMasterInputDto;
      const response = await this.userMasterController.create({
        ...input,
        birthday: new Date(input.birthday),
      });
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async findUserMaster(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userMasterController.find(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async updateUserMaster(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserMasterInputDto = req.body;
      input.id = id;
      const response = await this.userMasterController.update(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
}
