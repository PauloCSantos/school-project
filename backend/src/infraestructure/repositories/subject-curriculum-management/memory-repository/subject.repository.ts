import Subject from '@/modules/subject-curriculum-management/subject/domain/entity/subject.entity';
import SubjectGateway from '@/modules/subject-curriculum-management/subject/gateway/subject.gateway';

export default class MemorySubjectRepository implements SubjectGateway {
  private _subjects: Subject[];

  constructor(subjects: Subject[]) {
    subjects ? (this._subjects = subjects) : (this._subjects = []);
  }

  async find(id: string): Promise<Subject | undefined> {
    const subject = this._subjects.find(subject => subject.id.id === id);
    if (subject) {
      return subject;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Subject[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const subjects = this._subjects.slice(offS, qtd);

    return subjects;
  }
  async create(subject: Subject): Promise<string> {
    this._subjects.push(subject);
    return subject.id.id;
  }
  async update(subject: Subject): Promise<Subject> {
    const subjectIndex = this._subjects.findIndex(
      dbSubject => dbSubject.id.id === subject.id.id
    );
    if (subjectIndex !== -1) {
      return (this._subjects[subjectIndex] = subject);
    } else {
      throw new Error('Subject not found');
    }
  }
  async delete(id: string): Promise<string> {
    const subjectIndex = this._subjects.findIndex(
      dbSubject => dbSubject.id.id === id
    );
    if (subjectIndex !== -1) {
      this._subjects.splice(subjectIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Subject not found');
    }
  }
}
