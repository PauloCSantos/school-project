import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import CreateUserStudent from '../../application/usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '../../application/usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '../../application/usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '../../application/usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '../../application/usecases/student/updateUserStudent.usecase';
import { UserStudentController } from '../../interface/controller/student.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('UserStudentController unit test', () => {
  let policieService: PoliciesServiceInterface;
  let token: TokenData;

  const mockCreateUserStudent = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateUserStudent;
  });
  const mockFindUserStudent = jest.fn(() => {
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
    } as unknown as FindUserStudent;
  });
  const mockFindAllUserStudent = jest.fn(() => {
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
    } as unknown as FindAllUserStudent;
  });
  const mockUpdateUserStudent = jest.fn(() => {
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
    } as unknown as UpdateUserStudent;
  });
  const mockDeleteUserStudent = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteUserStudent;
  });

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });
  token = {
    email: 'caller@domain.com',
    role: 'master',
    masterId: new Id().value,
  };

  const createUserStudent = mockCreateUserStudent();
  const deleteUserStudent = mockDeleteUserStudent();
  const findAllUserStudent = mockFindAllUserStudent();
  const findUserStudent = mockFindUserStudent();
  const updateUserStudent = mockUpdateUserStudent();
  policieService = MockPolicyService();

  const controller = new UserStudentController(
    createUserStudent,
    findUserStudent,
    findAllUserStudent,
    updateUserStudent,
    deleteUserStudent,
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
        birthday: new Date('11-12-1995'),
        email: 'teste1@test.com',
        paymentYear: 40000,
      },
      token
    );

    expect(result).toBeDefined();
    expect(createUserStudent.execute).toHaveBeenCalled();
  });
  it('should return a user', async () => {
    const result = await controller.find({ id: new Id().value }, token);

    expect(result).toBeDefined();
    expect(findUserStudent.execute).toHaveBeenCalled();
  });
  it('should return all users', async () => {
    const result = await controller.findAll({}, token);

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllUserStudent.execute).toHaveBeenCalled();
  });
  it('should update an user', async () => {
    const result = await controller.update(
      {
        id: new Id().value,
        paymentYear: 42000,
      },
      token
    );

    expect(result).toBeDefined();
    expect(updateUserStudent.execute).toHaveBeenCalled();
  });
  it('should delete an user', async () => {
    const result = await controller.delete(
      {
        id: new Id().value,
      },
      token
    );

    expect(result).toBeDefined();
    expect(deleteUserStudent.execute).toHaveBeenCalled();
  });
});
