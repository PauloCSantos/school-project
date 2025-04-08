import CreateUserMaster from '../../application/usecases/master/createUserMaster.usecase';
import FindUserMaster from '../../application/usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '../../application/usecases/master/updateUserMaster.usecase';
import { UserMasterController } from '../../interface/controller/master.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('UserMasterController unit test', () => {
  const mockCreateUserMaster = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateUserMaster;
  });
  const mockFindUserMaster = jest.fn(() => {
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
        cnpj: '35.741.901/0001-58',
      }),
    } as unknown as FindUserMaster;
  });
  const mockUpdateUserMaster = jest.fn(() => {
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
        cnpj: '35.741.901/0001-58',
      }),
    } as unknown as UpdateUserMaster;
  });

  const createUserMaster = mockCreateUserMaster();
  const findUserMaster = mockFindUserMaster();
  const updateUserMaster = mockUpdateUserMaster();

  const controller = new UserMasterController(
    createUserMaster,
    findUserMaster,
    updateUserMaster
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
      birthday: new Date('11-12-1995'),
      email: 'teste1@test.com',
      cnpj: '35.741.901/0001-58',
    });

    expect(result).toBeDefined();
    expect(createUserMaster.execute).toHaveBeenCalled();
  });
  it('should return a user', async () => {
    const result = await controller.find({ id: new Id().value });

    expect(result).toBeDefined();
    expect(findUserMaster.execute).toHaveBeenCalled();
  });
  it('should update an user', async () => {
    const result = await controller.update({
      id: new Id().value,
      address: {
        street: 'Street B',
      },
    });

    expect(result).toBeDefined();
    expect(updateUserMaster.execute).toHaveBeenCalled();
  });
});
