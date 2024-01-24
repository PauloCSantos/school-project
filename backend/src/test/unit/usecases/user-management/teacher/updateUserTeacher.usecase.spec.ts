import UpdateUserTeacher from '@/application/usecases/user-management/teacher/updateUserTeacher.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/teacher/domain/entity/user-teacher.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(userTeacher => Promise.resolve(userTeacher)),
    delete: jest.fn(),
  };
};

describe('updateUserTeacher usecase unit test', () => {
  const input = {
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
    academicDegrees: 'Msc',
  };

  const userTeacher1 = new UserTeacher({
    name: new Name({
      firstName: 'John',
      middleName: 'David',
      lastName: 'Doe',
    }),
    address: new Address({
      street: 'Street A',
      city: 'City A',
      zip: '111111-111',
      number: 1,
      avenue: 'Avenue A',
      state: 'State A',
    }),
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    salary: new Salary({ salary: 2500 }),
    graduation: 'Math',
    academicDegrees: 'Msc',
  });

  describe('On fail', () => {
    it('should throw an error if the user does not exist', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateUserTeacher(userTeacherRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should update an user teacher', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.find.mockResolvedValue(userTeacher1);
      const usecase = new UpdateUserTeacher(userTeacherRepository);

      const result = await usecase.execute({
        id: userTeacher1.id.id,
        address: {
          street: 'Street B',
          city: 'City B',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue B',
          state: 'State B',
        },
      });

      expect(userTeacherRepository.update).toHaveBeenCalled();
      expect(userTeacherRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        name: {
          fullName: userTeacher1.name.fullName(),
          shortName: userTeacher1.name.shortName(),
        },
        address: {
          street: 'Street B',
          city: 'City B',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue B',
          state: 'State B',
        },
        birthday: new Date('11-12-1995'),
        email: 'teste1@test.com',
        salary: userTeacher1.salary.calculateTotalIncome(),
        graduation: 'Math',
        academicDegrees: 'Msc',
      });
    });
  });
});
