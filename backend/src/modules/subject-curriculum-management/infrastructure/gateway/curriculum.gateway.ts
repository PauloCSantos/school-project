import Curriculum from '../../domain/entity/curriculum.entity';

export default interface CurriculumGateway {
  find(id: string): Promise<Curriculum | null>;
  findAll(quantity?: number, offSet?: number): Promise<Curriculum[]>;
  create(curriculum: Curriculum): Promise<string>;
  update(curriculum: Curriculum): Promise<Curriculum>;
  delete(id: string): Promise<string>;
  addSubjects(id: string, newSubjectsList: string[]): Promise<string>;
  removeSubjects(id: string, subjectsListToRemove: string[]): Promise<string>;
}
