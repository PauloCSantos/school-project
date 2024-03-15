import CreateUserAdministrator from '@/application/usecases/user-management/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/application/usecases/user-management/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/application/usecases/user-management/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/application/usecases/user-management/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/application/usecases/user-management/administrator/updateUserAdministrator.usecase';
import { UserAdministratorController } from '@/interface/controller/user-management/user-administrator.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('UserAdministratorController unit test', () => {
  const mockCreateUserAdministrator = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().id),
    } as unknown as CreateUserAdministrator;
  });
  const mockFindUserAdministrator = jest.fn(() => {
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
        graduation: 'Math',
      }),
    } as unknown as FindUserAdministrator;
  });
  const mockFindAllUserAdministrator = jest.fn(() => {
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
          graduation: 'Spanish',
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
          graduation: 'Math',
        },
      ]),
    } as unknown as FindAllUserAdministrator;
  });
  const mockUpdateUserAdministrator = jest.fn(() => {
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
        graduation: 'Math',
      }),
    } as unknown as UpdateUserAdministrator;
  });
  const mockDeleteUserAdministrator = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteUserAdministrator;
  });

  const createUserAdministrator = mockCreateUserAdministrator();
  const deleteUserAdministrator = mockDeleteUserAdministrator();
  const findAllUserAdministrator = mockFindAllUserAdministrator();
  const findUserAdministrator = mockFindUserAdministrator();
  const updateUserAdministrator = mockUpdateUserAdministrator();

  const controller = new UserAdministratorController(
    createUserAdministrator,
    findUserAdministrator,
    findAllUserAdministrator,
    updateUserAdministrator,
    deleteUserAdministrator
  );

  it('should return a id for the new user created', async () => {
    const result = await controller.create({
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
      graduation: 'Math',
    });

    expect(result).toBeDefined();
    expect(createUserAdministrator.execute).toHaveBeenCalled();
  });
  it('should return a user', async () => {
    const result = await controller.find(new Id());

    expect(result).toBeDefined();
    expect(findUserAdministrator.execute).toHaveBeenCalled();
  });
  it('should return all users', async () => {
    const result = await controller.findAll({});

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllUserAdministrator.execute).toHaveBeenCalled();
  });
  it('should update an user', async () => {
    const result = await controller.update({
      id: new Id().id,
      salary: {
        salary: 500,
      },
    });

    expect(result).toBeDefined();
    expect(updateUserAdministrator.execute).toHaveBeenCalled();
  });
  it('should delete an users', async () => {
    const result = await controller.delete({
      id: new Id().id,
    });

    expect(result).toBeDefined();
    expect(deleteUserAdministrator.execute).toHaveBeenCalled();
  });
});
