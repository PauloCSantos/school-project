import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { UserAdministratorController } from '@/interface/controller/user-management/user-administrator.controller';
import { validId } from '@/util/validations';
export class UserAdministratorRoute {
  constructor(
    private readonly userAdministratorController: UserAdministratorController,
    private readonly expressInstance: HttpInterface,
    private readonly authMiddleware: AuthUserMiddleware
  ) {}

  public routes(): void {
    this.expressInstance.get('/user-administrators', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.findAllUserAdministrators(req, res)
      );
    });
    this.expressInstance.post('/user-administrator', (req: any, res: any) => {
      this.authMiddleware.handle(req, res, () =>
        this.createUserAdministrator(req, res)
      );
    });
    this.expressInstance.get(
      '/user-administrator/:id',
      (req: any, res: any) => {
        this.authMiddleware.handle(req, res, () =>
          this.findUserAdministrator(req, res)
        );
      }
    );
    this.expressInstance.patch(
      '/user-administrator/:id',
      (req: any, res: any) => {
        this.authMiddleware.handle(req, res, () =>
          this.updateUserAdministrator(req, res)
        );
      }
    );
    this.expressInstance.delete(
      '/user-administrator/:id',
      (req: any, res: any) => {
        this.authMiddleware.handle(req, res, () =>
          this.deleteUserAdministrator(req, res)
        );
      }
    );
  }

  private async findAllUserAdministrators(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      } else {
        const response = await this.userAdministratorController.findAll({
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
  private async createUserAdministrator(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.userAdministratorController.create({
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
  private async findUserAdministrator(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.userAdministratorController.find({ id });
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
  private async updateUserAdministrator(req: any, res: any): Promise<void> {
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
        const response = await this.userAdministratorController.update(input);
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
  private async deleteUserAdministrator(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.userAdministratorController.delete({ id });
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
      graduation,
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
      salary === undefined ||
      graduation === undefined
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
