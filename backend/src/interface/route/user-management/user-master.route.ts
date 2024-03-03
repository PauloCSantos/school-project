import { UserMasterController } from '@/interface/controller/user-management/user-master.controller';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { validId } from '@/util/validations';

export class UserMasterRoute {
  constructor(
    private readonly userMasterController: UserMasterController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.post('/user-master', (req: any, res: any) =>
      this.createUserMaster(req, res)
    );
    this.httpGateway.get('/user-master/:id', (req: any, res: any) =>
      this.findUserMaster(req, res)
    );
    this.httpGateway.patch('/user-master/:id', (req: any, res: any) =>
      this.updateUserMaster(req, res)
    );
  }

  private async createUserMaster(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.userMasterController.create({
          ...input,
          birthday: new Date(input.birthday),
        });
        res.status(201).json(response);
      }
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
      if (!this.validFind(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.userMasterController.find({ id });
        res.status(200).json(response);
      }
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
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        res.status(400).json({ error: 'Id e/ou input incorretos' });
      } else {
        input.id = id;
        const response = await this.userMasterController.update(input);
        res.status(200).json(response);
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private validateCreate(input: any): boolean {
    const {
      name: { firstName, lastName },
      address: { street, city, zip, number, avenue, state },
      email,
      birthday,
      cnpj,
    } = input;

    if (
      firstName === undefined ||
      lastName === undefined ||
      street === undefined ||
      city === undefined ||
      zip === undefined ||
      number === undefined ||
      avenue === undefined ||
      state === undefined ||
      email === undefined ||
      birthday === undefined ||
      cnpj === undefined
    ) {
      return false;
    } else {
      return true;
    }
  }
  private validFind(id: any): boolean {
    return validId(id);
  }
  private validUpdate(id: any, input: any): boolean {
    if (!validId(id)) return false;
    for (const value of Object.values(input)) {
      if (value !== undefined) {
        return true;
      }
    }
    return false;
  }
}
