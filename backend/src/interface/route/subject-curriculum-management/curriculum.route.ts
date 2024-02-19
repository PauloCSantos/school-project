import { CurriculumController } from '@/interface/controller/subject-curriculum-management/curriculum.controller';
import {
  AddSubjectsInputDto,
  CreateCurriculumInputDto,
  RemoveSubjectsInputDto,
  UpdateCurriculumInputDto,
} from '@/application/dto/subject-curriculum-management/curriculum-usecase.dto';
import { HttpInterface } from '@/infraestructure/http/http.interface';

export class CurriculumRoute {
  constructor(
    private readonly curriculumController: CurriculumController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/curriculum', (req: any, res: any) =>
      this.findAllCurriculums(req, res)
    );
    this.httpGateway.post('/curriculum', (req: any, res: any) =>
      this.createCurriculum(req, res)
    );
    this.httpGateway.get('/curriculum/:id', (req: any, res: any) =>
      this.findCurriculum(req, res)
    );
    this.httpGateway.patch('/curriculum/:id', (req: any, res: any) =>
      this.updateCurriculum(req, res)
    );
    this.httpGateway.delete('/curriculum/:id', (req: any, res: any) =>
      this.deleteCurriculum(req, res)
    );
    this.httpGateway.post('/curriculum/add', (req: any, res: any) =>
      this.addSubjects(req, res)
    );
    this.httpGateway.post('/curriculum/remove', (req: any, res: any) =>
      this.removeSubjects(req, res)
    );
  }

  private async findAllCurriculums(req: any, res: any): Promise<void> {
    try {
      const { quantity, offset } = req.body;
      const response = await this.curriculumController.findAll({
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
  private async createCurriculum(req: any, res: any): Promise<void> {
    try {
      const input = req.body as CreateCurriculumInputDto;
      const response = await this.curriculumController.create(input);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async findCurriculum(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.curriculumController.find(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async updateCurriculum(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateCurriculumInputDto = req.body;
      input.id = id;
      const response = await this.curriculumController.update(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async deleteCurriculum(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = { id };
      const response = await this.curriculumController.delete(input);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async addSubjects(req: any, res: any): Promise<void> {
    try {
      const input = req.body as AddSubjectsInputDto;
      const response = await this.curriculumController.addSubjects(input);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
  private async removeSubjects(req: any, res: any): Promise<void> {
    try {
      const input = req.body as RemoveSubjectsInputDto;
      const response = await this.curriculumController.removeSubjects(input);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
}
