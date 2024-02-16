import {
  CreateUserAdministratorInputDto,
  UpdateUserAdministratorInputDto,
} from '@/application/dto/user-management/administrator-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { UserAdministratorController } from '@/interface/controller/user-management/user-administrator.controller';
export class UserAdministratorRoute {
  constructor(
    private readonly userAdministratorController: UserAdministratorController,
    private readonly expressInstance: HttpInterface
  ) {}

  public routes(): void {
    this.expressInstance.get('/user-administrators', (req: any, res: any) =>
      this.findAllUserAdministrators(req, res)
    );
    this.expressInstance.post('/user-administrators', (req: any, res: any) =>
      this.createUserAdministrator(req, res)
    );
    this.expressInstance.get('/user-administrators/:id', (req: any, res: any) =>
      this.findUserAdministrator(req, res)
    );
    this.expressInstance.patch(
      '/user-administrators/:id',
      (req: any, res: any) => this.updateUserAdministrator(req, res)
    );
    this.expressInstance.delete(
      '/user-administrators/:id',
      (req: any, res: any) => this.deleteUserAdministrator(req, res)
    );
  }

  private async findAllUserAdministrators(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.userAdministratorController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async createUserAdministrator(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateUserAdministratorInputDto;
      const response = await this.userAdministratorController.create({
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
  private async findUserAdministrator(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userAdministratorController.find(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async updateUserAdministrator(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateUserAdministratorInputDto = req.body;
      input.id = id;
      input.birthday ? (input.birthday = new Date(input.birthday)) : undefined;
      const response = await this.userAdministratorController.update(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async deleteUserAdministrator(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.userAdministratorController.delete(input);
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
