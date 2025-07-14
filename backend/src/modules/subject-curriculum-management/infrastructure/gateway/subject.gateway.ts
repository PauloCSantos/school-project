import Subject from '../../domain/entity/subject.entity';

export default interface SubjectGateway {
  find(id: string): Promise<Subject | null>;
  findAll(quantity?: number, offSet?: number): Promise<Subject[]>;
  create(subject: Subject): Promise<string>;
  update(subject: Subject): Promise<Subject>;
  delete(id: string): Promise<string>;
}
