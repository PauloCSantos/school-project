import Subject from '../../domain/entity/subject.entity';

export default interface SubjectGateway {
  find(masterId: string, id: string): Promise<Subject | null>;
  findAll(masterId: string, quantity?: number, offSet?: number): Promise<Subject[]>;
  create(masterId: string, subject: Subject): Promise<string>;
  update(masterId: string, subject: Subject): Promise<Subject>;
  delete(masterId: string, subject: Subject): Promise<string>;
}
