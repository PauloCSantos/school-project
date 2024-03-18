import AddSubjects from '@/application/usecases/subject-curriculum-management/curriculum/addSubjects.usecase';
import CreateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/createCurriculum.usecase';
import DeleteCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/deleteCurriculum.usecase';
import FindAllCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findAllCurriculum.usecase';
import FindCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findCurriculum.usecase';
import RemoveSubjects from '@/application/usecases/subject-curriculum-management/curriculum/removeSubjects.usecase';
import UpdateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/updateCurriculum.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryCurriculumRepository from '@/infraestructure/repositories/subject-curriculum-management/memory-repository/curriculum.repository';
import { CurriculumController } from '@/interface/controller/subject-curriculum-management/curriculum.controller';
import { CurriculumRoute } from '@/interface/route/subject-curriculum-management/curriculum.route';

export default function initializeCurriculum(express: ExpressHttp): void {
  const curriculumRepository = new MemoryCurriculumRepository();

  const createCurriculumUsecase = new CreateCurriculum(curriculumRepository);
  const findCurriculumUsecase = new FindCurriculum(curriculumRepository);
  const findAllCurriculumUsecase = new FindAllCurriculum(curriculumRepository);
  const updateCurriculumUsecase = new UpdateCurriculum(curriculumRepository);
  const deleteCurriculumUsecase = new DeleteCurriculum(curriculumRepository);
  const addSubjects = new AddSubjects(curriculumRepository);
  const removeSubjects = new RemoveSubjects(curriculumRepository);

  const curriculumController = new CurriculumController(
    createCurriculumUsecase,
    findCurriculumUsecase,
    findAllCurriculumUsecase,
    updateCurriculumUsecase,
    deleteCurriculumUsecase,
    addSubjects,
    removeSubjects
  );

  const curriculumRoute = new CurriculumRoute(curriculumController, express);
  curriculumRoute.routes();
}
