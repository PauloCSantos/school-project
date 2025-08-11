import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import CurriculumGateway from '../../../application/gateway/curriculum.gateway';

export default class MemoryCurriculumRepository implements CurriculumGateway {
  private _curriculums: Curriculum[];

  constructor(curriculums?: Curriculum[]) {
    curriculums ? (this._curriculums = curriculums) : (this._curriculums = []);
  }

  async find(id: string): Promise<Curriculum | null> {
    const curriculum = this._curriculums.find(
      curriculum => curriculum.id.value === id
    );
    if (curriculum) {
      return curriculum;
    } else {
      return null;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Curriculum[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const curriculums = this._curriculums.slice(offS, qtd);

    return curriculums;
  }
  async create(curriculum: Curriculum): Promise<string> {
    this._curriculums.push(curriculum);
    return curriculum.id.value;
  }
  async update(curriculum: Curriculum): Promise<Curriculum> {
    const curriculumIndex = this._curriculums.findIndex(
      dbCurriculum => dbCurriculum.id.value === curriculum.id.value
    );
    if (curriculumIndex !== -1) {
      return (this._curriculums[curriculumIndex] = curriculum);
    } else {
      throw new Error('Curriculum not found');
    }
  }
  async delete(id: string): Promise<string> {
    const curriculumIndex = this._curriculums.findIndex(
      dbCurriculum => dbCurriculum.id.value === id
    );
    if (curriculumIndex !== -1) {
      this._curriculums.splice(curriculumIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Curriculum not found');
    }
  }
  async addSubjects(id: string, newSubjectsList: string[]): Promise<string> {
    const curriculumIndex = this._curriculums.findIndex(
      dbCurriculum => dbCurriculum.id.value === id
    );
    if (curriculumIndex !== -1) {
      try {
        const updatedSubject = this._curriculums[curriculumIndex];
        newSubjectsList.forEach(subjectId => {
          updatedSubject.addSubject(subjectId);
        });
        this._curriculums[curriculumIndex] = updatedSubject;
        return `${newSubjectsList.length} ${
          newSubjectsList.length === 1 ? 'value was' : 'values were'
        } entered`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Curriculum not found');
    }
  }
  async removeSubjects(
    id: string,
    subjectsListToRemove: string[]
  ): Promise<string> {
    const curriculumIndex = this._curriculums.findIndex(
      dbCurriculum => dbCurriculum.id.value === id
    );
    if (curriculumIndex !== -1) {
      try {
        const updatedSubject = this._curriculums[curriculumIndex];
        subjectsListToRemove.forEach(subjectId => {
          updatedSubject.removeSubject(subjectId);
        });
        this._curriculums[curriculumIndex] = updatedSubject;
        return `${subjectsListToRemove.length} ${
          subjectsListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Curriculum not found');
    }
  }
}
