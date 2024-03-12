import AuthUserController from '@/interface/controller/authentication-authorization-management/authUser.controller';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { isNotEmpty, validEmail, validRole } from '@/util/validations';

export default class AuthUserRoute {
  constructor(
    private readonly authUserController: AuthUserController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/authUser/:email', (req: any, res: any) =>
      this.findAuthUser(req, res)
    );
    this.httpGateway.patch('/authUser/:email', (req: any, res: any) =>
      this.updateAuthUser(req, res)
    );
    this.httpGateway.delete('/authUser/:email', (req: any, res: any) =>
      this.deleteAuthUser(req, res)
    );
    this.httpGateway.post('/register', (req: any, res: any) =>
      this.createAuthUser(req, res)
    );
    this.httpGateway.post('/login', (req: any, res: any) =>
      this.loginAuthUser(req, res)
    );
  }

  private async createAuthUser(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.authUserController.create(input);
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
  private async findAuthUser(req: any, res: any): Promise<void> {
    try {
      const { email } = req.params;
      if (!this.validFind(email)) {
        res.status(400).json({ error: 'Email invalido' });
      } else {
        const response = await this.authUserController.find({ email });
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
  private async updateAuthUser(req: any, res: any): Promise<void> {
    try {
      const { email } = req.params;
      const input = req.body;
      if (!this.validUpdate(email, input)) {
        res.status(400).json({ error: 'Email e/ou input incorretos' });
      } else {
        input.email = email;
        const response = await this.authUserController.update(input);
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
  private async deleteAuthUser(req: any, res: any): Promise<void> {
    try {
      const { email } = req.params;
      if (!this.validDelete(email)) {
        res.status(400).json({ error: 'Email invalido' });
      } else {
        const response = await this.authUserController.delete({ email });
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
  private async loginAuthUser(req: any, res: any): Promise<void> {
    try {
      const { email, password, role } = req.body;
      if (!this.validLogin(email, password, role)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.authUserController.login({
          email,
          password,
          role,
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

  private validateCreate(input: any): boolean {
    const { email, password, role } = input;

    if (email === undefined || password === undefined || role === undefined) {
      return false;
    } else {
      return true;
    }
  }
  private validFind(email: any): boolean {
    return validEmail(email);
  }
  private validUpdate(email: any, input: any): boolean {
    if (!validEmail(email)) return false;
    for (const value of Object.values(input)) {
      if (value !== undefined) {
        return true;
      }
    }
    return false;
  }
  private validDelete(email: any): boolean {
    return validEmail(email);
  }
  private validLogin(email: string, password: string, role: string): boolean {
    if (!validEmail(email) || !isNotEmpty(password) || !validRole(role)) {
      return false;
    } else {
      return true;
    }
  }
}
