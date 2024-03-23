import { UserWorkerController } from '@/interface/controller/user-management/user-worker.controller';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { validId } from '@/util/validations';
import AuthUserMiddleware from '@/application/middleware/authUser.middleware';

export class UserWorkerRoute {
  constructor(
    private readonly userWorkerController: UserWorkerController,
    private readonly httpGateway: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.httpGateway.get('/user-workers', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.findAllUserWorkers(req, res)
      );
    });
    this.httpGateway.post('/user-worker', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.createUserWorker(req, res)
      );
    });
    this.httpGateway.get('/user-worker/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () => this.findUserWorker(req, res));
    });
    this.httpGateway.patch('/user-worker/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.updateUserWorker(req, res)
      );
    });
    this.httpGateway.delete('/user-worker/:id', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.deleteUserWorker(req, res)
      );
    });
  }

  private async findAllUserWorkers(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      } else {
        const response = await this.userWorkerController.findAll({
          quantity,
          offset,
        });
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
  private async createUserWorker(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.userWorkerController.create({
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
  private async findUserWorker(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const any = await this.userWorkerController.find({ id });
        res.status(200).json(any);
      }
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
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        res.status(400).json({ error: 'Id e/ou input incorretos' });
      } else {
        input.id = id;
        input.birthday
          ? (input.birthday = new Date(input.birthday))
          : undefined;
        const response = await this.userWorkerController.update(input);
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
  private async deleteUserWorker(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.userWorkerController.delete({ id });
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
  private validateFindAll(
    quantity: number | undefined,
    offset: number | undefined
  ): boolean {
    if (
      quantity === undefined ||
      (typeof quantity === 'number' &&
        isNaN(quantity) &&
        offset === undefined) ||
      (typeof offset === 'number' && isNaN(offset))
    ) {
      return true;
    } else {
      return false;
    }
  }
  private validateCreate(input: any): boolean {
    const {
      name: { firstName, lastName },
      address: { street, city, zip, number, avenue, state },
      email,
      birthday,
      salary: { salary },
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
      salary === undefined
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
  private validDelete(id: any): boolean {
    return validId(id);
  }
}
