import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { SubjectController } from '@/interface/controller/subject-curriculum-management/subject.controller';
import {
  CreateSubjectInputDto,
  UpdateSubjectInputDto,
} from '@/application/dto/subject-curriculum-management/subject-usecase.dto';

export class SubjectRoute {
  constructor(
    private readonly subjectController: SubjectController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/subject', this.findAllSubjects);
    this.httpGateway.post('/subject', this.createSubject);
    this.httpGateway.get('/subject/:id', this.findSubject);
    this.httpGateway.put('/subject/:id', this.updateSubject);
    this.httpGateway.delete('/subject/:id', this.deleteSubject);
  }

  private async findAllSubjects(req: Request, res: Response): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.subjectController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createSubject(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateSubjectInputDto;
      const response = await this.subjectController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findSubject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.subjectController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateSubject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateSubjectInputDto = req.body;
      input.id = id;
      const response = await this.subjectController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteSubject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.subjectController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}
