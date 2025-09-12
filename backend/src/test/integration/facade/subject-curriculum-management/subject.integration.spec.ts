import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import SubjectFacadeFactory from '@/modules/subject-curriculum-management/application/factory/subject.factory';
import MemorySubjectRepository from '@/modules/subject-curriculum-management/infrastructure/repositories/memory-repository/subject.repository';

describe('Subject facade integration test', () => {
  let repository = new MemorySubjectRepository();
  let policiesService = new PoliciesService();

  const input = {
    name: 'Math',
    description: 'Nice description',
  };
  const input2 = {
    name: 'English',
    description: 'Nice description',
  };
  const input3 = {
    name: 'Portuguese',
    description: 'Nice description',
  };
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: RoleUsersEnum.MASTER,
  };

  beforeEach(() => {
    repository = new MemorySubjectRepository();
    policiesService = new PoliciesService();
  });

  it('should create an Subject using the facade', async () => {
    const facade = SubjectFacadeFactory.create(repository, policiesService);
    const result = await facade.create(input, token);

    expect(result.id).toBeDefined();
  });
  it('should find an Subject using the facade', async () => {
    const facade = SubjectFacadeFactory.create(repository, policiesService);
    const result = await facade.create(input, token);
    const userSubject = await facade.find(result, token);

    expect(userSubject).toBeDefined();
  });
  it('should find all users Subject using the facade', async () => {
    const facade = SubjectFacadeFactory.create(repository, policiesService);
    await facade.create(input, token);
    await facade.create(input2, token);
    await facade.create(input3, token);
    const allUsers = await facade.findAll({}, token);

    expect(allUsers.length).toBe(3);
  });
  it('should delete an Subject using the facade', async () => {
    const facade = SubjectFacadeFactory.create(repository, policiesService);
    await facade.create(input, token);
    const id2 = await facade.create(input2, token);
    await facade.create(input3, token);
    const result = await facade.delete({ id: id2.id }, token);
    // const allUsers = await facade.findAll({}, token);

    expect(result.message).toBe('Operation completed successfully');
    //expect(allUsers.length).toBe(2);
  });
  it('should update an Subject using the facade', async () => {
    const facade = SubjectFacadeFactory.create(repository, policiesService);
    const id = await facade.create(input, token);

    const result = await facade.update(
      {
        id: id.id,
        description: 'New amazing description',
      },
      token
    );

    expect(result).toBeDefined();
  });
});
