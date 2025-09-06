import AdministratorFacadeInterface from '@/modules/user-management/application/facade/interface/administrator-facade.interface';
import MasterFacadeInterface from '@/modules/user-management/application/facade/interface/master-facade.interface';
import StudentFacadeInterface from '@/modules/user-management/application/facade/interface/student-facade.interface';
import TeacherFacadeInterface from '@/modules/user-management/application/facade/interface/teacher-facade.interface';
import WorkerFacadeInterface from '@/modules/user-management/application/facade/interface/worker-facade.interface';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { toRoleType } from '@/modules/@shared/utils/formatting';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { InternalError } from '@/modules/@shared/application/errors/internal.error';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

export default class CheckRegistration implements UseCaseInterface<TokenData, Boolean> {
  constructor(
    private readonly masterFacade: MasterFacadeInterface,
    private readonly administratorFacade: AdministratorFacadeInterface,
    private readonly teacherFacade: TeacherFacadeInterface,
    private readonly studentFacade: StudentFacadeInterface,
    private readonly workerFacade: WorkerFacadeInterface
  ) {}

  async execute(token: TokenData): Promise<Boolean> {
    toRoleType(token.role);
    switch (token.role) {
      case RoleUsersEnum.MASTER:
        return await this.masterFacade.checkUserMasterFromToken(token);
      case RoleUsersEnum.ADMINISTRATOR:
        return await this.administratorFacade.checkUserAdministratorFromToken(token);
      case RoleUsersEnum.TEACHER:
        return await this.teacherFacade.checkUserTeacherFromToken(token);
      case RoleUsersEnum.STUDENT:
        return await this.studentFacade.checkUserStudentFromToken(token);
      case RoleUsersEnum.WORKER:
        return await this.workerFacade.checkUserWorkerFromToken(token);
      default:
        throw new InternalError('Invalid role');
    }
  }
}
