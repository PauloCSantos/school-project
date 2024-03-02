import { EvaluationController } from '@/interface/controller/evaluation-note-attendance-management/evaluation.controller';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { validId } from '@/util/validations';

export class EvaluationRoute {
  constructor(
    private readonly evaluationController: EvaluationController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/evaluations', (req: any, res: any) =>
      this.findAllEvaluations(req, res)
    );
    this.httpGateway.post('/evaluation', (req: any, res: any) =>
      this.createEvaluation(req, res)
    );
    this.httpGateway.get('/evaluation/:id', (req: any, res: any) =>
      this.findEvaluation(req, res)
    );
    this.httpGateway.patch('/evaluation/:id', (req: any, res: any) =>
      this.updateEvaluation(req, res)
    );
    this.httpGateway.delete('/evaluation/:id', (req: any, res: any) =>
      this.deleteEvaluation(req, res)
    );
  }

  private async findAllEvaluations(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      if (!this.validateFindAll(quantity, offset)) {
        res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      } else {
        const response = await this.evaluationController.findAll({
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
  private async createEvaluation(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.evaluationController.create(input);
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
  private async findEvaluation(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.evaluationController.find({ id });
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
  private async updateEvaluation(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        res.status(400).json({ error: 'Id e/ou input incorretos' });
      } else {
        input.id = id;
        const response = await this.evaluationController.update(input);
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
  private async deleteEvaluation(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.evaluationController.delete({ id });
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
    const { lesson, teacher, type, value } = input;

    if (
      lesson === undefined ||
      teacher === undefined ||
      type === undefined ||
      value === undefined
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
