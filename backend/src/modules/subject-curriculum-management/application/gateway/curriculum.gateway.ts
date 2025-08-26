import Curriculum from '../../domain/entity/curriculum.entity';

export default interface CurriculumGateway {
  find(masterId: string, id: string): Promise<Curriculum | null>;
  findAll(masterId: string, quantity?: number, offSet?: number): Promise<Curriculum[]>;
  create(masterId: string, curriculum: Curriculum): Promise<string>;
  update(masterId: string, curriculum: Curriculum): Promise<Curriculum>;
  delete(masterId: string, curriculum: Curriculum): Promise<string>;
  addSubjects(masterId: string, id: string, curriculum: Curriculum): Promise<string>;
  removeSubjects(masterId: string, id: string, curriculum: Curriculum): Promise<string>;
}
