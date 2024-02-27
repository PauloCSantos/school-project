import { CurriculumController } from '@/interface/controller/subject-curriculum-management/curriculum.controller';
import { HttpInterface } from '@/infraestructure/http/http.interface';
import { validId } from '@/util/validations';

export class CurriculumRoute {
  constructor(
    private readonly curriculumController: CurriculumController,
    private readonly httpGateway: HttpInterface
  ) {}

  public routes(): void {
    this.httpGateway.get('/curriculums', (req: any, res: any) =>
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
      if (!this.validateFindAll(quantity, offset)) {
        res
          .status(400)
          .json({ error: 'Quantity e/ou offset estão incorretos' });
      } else {
        const response = await this.curriculumController.findAll({
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
  private async createCurriculum(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validateCreate(input)) {
        res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
      } else {
        const response = await this.curriculumController.create(input);
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
  private async findCurriculum(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validFind(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.curriculumController.find({ id });
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
  private async updateCurriculum(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body;
      if (!this.validUpdate(id, input)) {
        res.status(400).json({ error: 'Id e/ou input incorretos' });
      } else {
        input.id = id;
        const response = await this.curriculumController.update(input);
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
  private async deleteCurriculum(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;
      if (!this.validDelete(id)) {
        res.status(400).json({ error: 'Id invalido' });
      } else {
        const response = await this.curriculumController.delete({ id });
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
  private async addSubjects(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validAdd(input)) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.curriculumController.addSubjects(input);
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
  private async removeSubjects(req: any, res: any): Promise<void> {
    try {
      const input = req.body;
      if (!this.validRemove(input)) {
        res.status(400).json({ error: 'Dados invalidos' });
      } else {
        const response = await this.curriculumController.removeSubjects(input);
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
    const { name, subjectsList, yearsToComplete } = input;

    if (
      name === undefined ||
      subjectsList === undefined ||
      yearsToComplete === undefined
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
  private validAdd(input: any): boolean {
    if (!validId(input.id) || input.newSubjectsList === undefined) return false;
    return true;
  }
  private validRemove(input: any): boolean {
    if (!validId(input.id) || input.subjectsListToRemove === undefined)
      return false;
    return true;
  }
}
