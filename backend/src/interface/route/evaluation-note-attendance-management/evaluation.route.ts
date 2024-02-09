import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { EvaluationController } from '@/interface/controller/evaluation-note-attendance-management/evaluation.controller';
import {
  CreateEvaluationInputDto,
  UpdateEvaluationInputDto,
} from '@/application/dto/evaluation-note-attendance-management/evaluation-usecase.dto';

export class EvaluationRoute {
  constructor(
    private readonly evaluationController: EvaluationController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/evaluation', this.findAllEvaluations);
    this.httpGateway.post('/evaluation', this.createEvaluation);
    this.httpGateway.get('/evaluation/:id', this.findEvaluation);
    this.httpGateway.put('/evaluation/:id', this.updateEvaluation);
    this.httpGateway.delete('/evaluation/:id', this.deleteEvaluation);
  }

  private async findAllEvaluations(req: Request, res: Response): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.evaluationController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createEvaluation(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateEvaluationInputDto;
      const response = await this.evaluationController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findEvaluation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.evaluationController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateEvaluation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateEvaluationInputDto = req.body;
      input.id = id;
      const response = await this.evaluationController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteEvaluation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.evaluationController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
