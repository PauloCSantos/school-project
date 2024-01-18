import Curriculum from '../domain/entity/curriculum.entity';

export default interface CurriculumGateway {
  find(id: string): Promise<Omit<Curriculum, 'id'> | undefined>;
  findAll(
    quantity?: number,
    offSet?: number
  ): Promise<Omit<Curriculum, 'id'>[]>;
  create(curriculum: Curriculum): Promise<string>;
  update(curriculum: Curriculum): Promise<Omit<Curriculum, 'id'>>;
  delete(id: string): Promise<string>;
  addSubjects(id: string, newSubjectsList: string[]): Promise<string>;
  removeSubjects(id: string, subjectsListToRemove: string[]): Promise<string>;
}
