import DeleteUserTeacher from '@/modules/user-management/application/usecases/teacher/deleteUserTeacher.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/user-teacher.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
  };
};

describe('deleteUserTeacher usecase unit test', () => {
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

  const userTeacher = new UserTeacher({
    name: new Name(input.name),
    address: new Address(input.address),
    salary: new Salary(input.salary),
    birthday: input.birthday,
    email: input.email,
    graduation: input.graduation,
    academicDegrees: input.academicDegrees,
  });

  describe('On fail', () => {
    it('should return an error if the user does not exist', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteUserTeacher(userTeacherRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should delete a user teacher', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.find.mockResolvedValue(userTeacher);
      const usecase = new DeleteUserTeacher(userTeacherRepository);
      const result = await usecase.execute({
        id: userTeacher.id.id,
      });

      expect(userTeacherRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
