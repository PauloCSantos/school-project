import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import CreateUserTeacher from '../../application/usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '../../application/usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '../../application/usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '../../application/usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '../../application/usecases/teacher/updateUserTeacher.usecase';
import { UserTeacherController } from '../../interface/controller/teacher.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('UserTeacherController unit test', () => {
  let policieService: PoliciesServiceInterface;
  let token: TokenData;

  const mockCreateUserTeacher = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateUserTeacher;
  });
  const mockFindUserTeacher = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        name: { fullName: 'John David Doe', shortName: 'John D D' },
        address: {
          street: 'Street A',
          city: 'City A',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue A',
          state: 'State A',
        },
        email: 'teste1@test.com',
        birthday: '1995-11-12T00:00:00.000Z',
        salary: 'R$:2500',
        academicDegrees: 'Msc',
        graduation: 'Math',
      }),
    } as unknown as FindUserTeacher;
  });
  const mockFindAllUserTeacher = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue([
        {
          name: { fullName: 'John David Doe', shortName: 'John D D' },
          address: {
            street: 'Street A',
            city: 'City A',
            zip: '111111-111',
            number: 1,
            avenue: 'Avenue A',
            state: 'State A',
          },
          email: 'teste1@test.com',
          birthday: '1995-11-12T00:00:00.000Z',
          salary: 'R$:2500',
          academicDegrees: 'Msc',
          graduation: 'Math',
        },
        {
          name: { fullName: 'Marie Rose', shortName: 'Marie R' },
          address: {
            street: 'Street B',
            city: 'City B',
            zip: '111111-222',
            number: 2,
            avenue: 'Avenue B',
            state: 'State B',
          },
          email: 'teste2@test.com',
          birthday: '2000-21-07T00:00:00.000Z',
          salary: 'R$:3500',
          academicDegrees: 'Dra',
          graduation: 'Spanish',
        },
      ]),
    } as unknown as FindAllUserTeacher;
  });
  const mockUpdateUserTeacher = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        name: { fullName: 'John David Doe', shortName: 'John D D' },
        address: {
          street: 'Street A',
          city: 'City A',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue A',
          state: 'State A',
        },
        email: 'teste1@test.com',
        birthday: '1995-11-12T00:00:00.000Z',
        salary: 'R$:2500',
        academicDegrees: 'Msc',
        graduation: 'Math',
      }),
    } as unknown as UpdateUserTeacher;
  });
  const mockDeleteUserTeacher = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteUserTeacher;
  });

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });
  token = {
    email: 'caller@domain.com',
    role: 'master',
    masterId: new Id().value,
  };

  const createUserTeacher = mockCreateUserTeacher();
  const deleteUserTeacher = mockDeleteUserTeacher();
  const findAllUserTeacher = mockFindAllUserTeacher();
  const findUserTeacher = mockFindUserTeacher();
  const updateUserTeacher = mockUpdateUserTeacher();
  policieService = MockPolicyService();

  const controller = new UserTeacherController(
    createUserTeacher,
    findUserTeacher,
    findAllUserTeacher,
    updateUserTeacher,
    deleteUserTeacher,
    policieService
  );

  it('should return a id for the new user created', async () => {
    const result = await controller.create(
      {
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        address: {
          street: 'Street A',
          city: 'City A',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue A',
          state: 'State A',
        },
        salary: {
          salary: 5000,
        },
        birthday: new Date('11-12-1995'),
        email: 'teste1@test.com',
        academicDegrees: 'Msc',
        graduation: 'Math',
      },
      token
    );

    expect(result).toBeDefined();
    expect(createUserTeacher.execute).toHaveBeenCalled();
  });
  it('should return a user', async () => {
    const result = await controller.find({ id: new Id().value }, token);

    expect(result).toBeDefined();
    expect(findUserTeacher.execute).toHaveBeenCalled();
  });
  it('should return all users', async () => {
    const result = await controller.findAll({}, token);

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllUserTeacher.execute).toHaveBeenCalled();
  });
  it('should update an user', async () => {
    const result = await controller.update(
      {
        id: new Id().value,
        salary: {
          salary: 500,
        },
      },
      token
    );

    expect(result).toBeDefined();
    expect(updateUserTeacher.execute).toHaveBeenCalled();
  });
  it('should delete an users', async () => {
    const result = await controller.delete(
      {
        id: new Id().value,
      },
      token
    );

    expect(result).toBeDefined();
    expect(deleteUserTeacher.execute).toHaveBeenCalled();
  });
});
