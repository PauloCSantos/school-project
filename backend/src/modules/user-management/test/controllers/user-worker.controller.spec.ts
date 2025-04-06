import CreateUserWorker from '../../application/usecases/worker/createUserWorker.usecase';
import DeleteUserWorker from '../../application/usecases/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '../../application/usecases/worker/findAllUserWorker.usecase';
import FindUserWorker from '../../application/usecases/worker/findUserWorker.usecase';
import UpdateUserWorker from '../../application/usecases/worker/updateUserWorker.usecase';
import { UserWorkerController } from '../../interface/controller/user-worker.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('UserWorkerController unit test', () => {
  const mockCreateUserWorker = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateUserWorker;
  });
  const mockFindUserWorker = jest.fn(() => {
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
      }),
    } as unknown as FindUserWorker;
  });
  const mockFindAllUserWorker = jest.fn(() => {
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
        },
      ]),
    } as unknown as FindAllUserWorker;
  });
  const mockUpdateUserWorker = jest.fn(() => {
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
      }),
    } as unknown as UpdateUserWorker;
  });
  const mockDeleteUserWorker = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteUserWorker;
  });

  const createUserWorker = mockCreateUserWorker();
  const deleteUserWorker = mockDeleteUserWorker();
  const findAllUserWorker = mockFindAllUserWorker();
  const findUserWorker = mockFindUserWorker();
  const updateUserWorker = mockUpdateUserWorker();

  const controller = new UserWorkerController(
    createUserWorker,
    findUserWorker,
    findAllUserWorker,
    updateUserWorker,
    deleteUserWorker
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
    });

    expect(result).toBeDefined();
  });
  it('should return a user', async () => {
    const result = await controller.find({ id: new Id().value });

    expect(result).toBeDefined();
  });
  it('should return all users', async () => {
    const result = await controller.findAll({});

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });
  it('should update an user', async () => {
    const result = await controller.update({
      id: new Id().value,
      salary: {
        salary: 500,
      },
    });

    expect(result).toBeDefined();
  });
  it('should delete an users', async () => {
    const result = await controller.delete({
      id: new Id().value,
    });

    expect(result).toBeDefined();
  });
});
