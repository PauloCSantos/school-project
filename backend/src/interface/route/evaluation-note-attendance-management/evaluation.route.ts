import { EvaluationController } from '@/interface/controller/evaluation-note-attendance-management/evaluation.controller';
import {
  CreateEvaluationInputDto,
  UpdateEvaluationInputDto,
} from '@/application/dto/evaluation-note-attendance-management/evaluation-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class EvaluationRoute {
  constructor(
    private readonly evaluationController: EvaluationController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/evaluation', (req: any, res: any) =>
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
      const response = await this.evaluationController.findAll({
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
  private async createEvaluation(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateEvaluationInputDto;
      const response = await this.evaluationController.create(input);
      res.status(201).json(response);
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
      const input = { id };
      const response = await this.evaluationController.find(input);
      res.status(200).json(response);
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
      const input: UpdateEvaluationInputDto = req.body;
      input.id = id;
      const response = await this.evaluationController.update(input);
      res.status(200).json(response);
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
      const input = { id };
      const response = await this.evaluationController.delete(input);
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
