import Subject from '../domain/entity/subject.entity';

export default interface SubjectGateway {
  find(id: string): Promise<Omit<Subject, 'id'> | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<Omit<Subject, 'id'>[]>;
  create(subject: Subject): Promise<string>;
  update(subject: Subject): Promise<Omit<Subject, 'id'>>;
  delete(id: string): Promise<string>;
}
