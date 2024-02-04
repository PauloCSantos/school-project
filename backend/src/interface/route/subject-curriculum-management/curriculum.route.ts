import { Request, Response } from 'express';
import ExpressHttpGateway from '@/infraestructure/http/express-http.gateway';
import { CurriculumController } from '@/interface/controller/subject-curriculum-management/curriculum.controller';
import {
  AddSubjectsInputDto,
  CreateCurriculumInputDto,
  RemoveSubjectsInputDto,
  UpdateCurriculumInputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';

export class CurriculumRoute {
  constructor(
    private readonly curriculumController: CurriculumController,
    private readonly httpGateway: ExpressHttpGateway
  ) {}

  public routes(): void {
    this.httpGateway.get('/curriculum', this.findAllCurriculums);
    this.httpGateway.post('/curriculum', this.createCurriculum);
    this.httpGateway.get('/curriculum/:id', this.findCurriculum);
    this.httpGateway.put('/curriculum/:id', this.updateCurriculum);
    this.httpGateway.delete('/curriculum/:id', this.deleteCurriculum);
    this.httpGateway.post('curriculum/add', this.addSubjects);
    this.httpGateway.post('curriculum/remove', this.removeSubjects);
  }

  private async findAllCurriculums(req: Request, res: Response): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.curriculumController.findAll({
        quantity,
        offset,
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(204).json({ error });
    }
  }
  private async createCurriculum(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CreateCurriculumInputDto;
      const response = await this.curriculumController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findCurriculum(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.curriculumController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateCurriculum(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateCurriculumInputDto = req.body;
      input.id = id;
      const response = await this.curriculumController.update(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async deleteCurriculum(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.curriculumController.delete(input);
      res.status(204).json({ response });
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async addSubjects(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as AddSubjectsInputDto;
      const response = await this.curriculumController.addSubjects(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async removeSubjects(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as RemoveSubjectsInputDto;
      const response = await this.curriculumController.removeSubjects(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
