import { SubjectController } from '@/interface/controller/subject-curriculum-management/subject.controller';
import {
  CreateSubjectInputDto,
  UpdateSubjectInputDto,
} from '@/application/dto/subject-curriculum-management/subject-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class SubjectRoute {
  constructor(
    private readonly subjectController: SubjectController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/subject', (req: any, res: any) =>
      this.findAllSubjects(req, res)
    );
    this.httpGateway.post('/subject', (req: any, res: any) =>
      this.createSubject(req, res)
    );
    this.httpGateway.get('/subject/:id', (req: any, res: any) =>
      this.findSubject(req, res)
    );
    this.httpGateway.put('/subject/:id', (req: any, res: any) =>
      this.updateSubject(req, res)
    );
    this.httpGateway.delete('/subject/:id', (req: any, res: any) =>
      this.deleteSubject(req, res)
    );
  }

  private async findAllSubjects(req: any, res: any): Promise<void> {
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
  private async createSubject(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateSubjectInputDto;
      const response = await this.subjectController.create(input);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  private async findSubject(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.subjectController.find(input);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  private async updateSubject(req: any, res: any): Promise<void> {
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
  private async deleteSubject(req: any, res: any): Promise<void> {
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
