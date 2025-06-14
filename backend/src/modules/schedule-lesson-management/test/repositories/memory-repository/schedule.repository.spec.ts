import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';
import MemoryScheduleRepository from '@/modules/schedule-lesson-management/infrastructure/repositories/memory-repository/schedule.repository';

describe('MemoryScheduleRepository unit test', () => {
  let repository: MemoryScheduleRepository;

  const student1 = new Id().value;
  const student2 = new Id().value;
  const student3 = new Id().value;
  const curriculum1 = new Id().value;
  const curriculum2 = new Id().value;
  const curriculum3 = new Id().value;
  const lessonsList1 = [new Id().value, new Id().value, new Id().value];
  const lessonsList2 = [new Id().value, new Id().value, new Id().value];
  const lessonsList3 = [new Id().value, new Id().value, new Id().value];

  const schedule1 = new Schedule({
    student: student1,
    curriculum: curriculum1,
    lessonsList: lessonsList1,
  });
  const schedule2 = new Schedule({
    student: student2,
    curriculum: curriculum2,
    lessonsList: lessonsList2,
  });
  const schedule3 = new Schedule({
    student: student3,
    curriculum: curriculum3,
    lessonsList: lessonsList3,
  });

  beforeEach(() => {
    repository = new MemoryScheduleRepository([schedule1, schedule2]);
  });

  describe('On fail', () => {
    it('should received an null', async () => {
      const scheduleId = new Id().value;
      const scheduleFound = await repository.find(scheduleId);

      expect(scheduleFound).toBeNull();
    });
    it('should throw an error when the Id is wrong', async () => {
      const schedule = new Schedule({
        id: new Id(),
        student: student3,
        curriculum: curriculum3,
        lessonsList: lessonsList3,
      });

      await expect(repository.update(schedule)).rejects.toThrow(
        'Schedule not found'
      );
    });
    it('should generate an error when trying to remove the schedule with the wrong ID', async () => {
      await expect(repository.delete(new Id().value)).rejects.toThrow(
        'Schedule not found'
      );
    });
    it('should generate an error when trying to remove the lesson from schedule with the wrong schedule ID', async () => {
      await expect(
        repository.removeLessons(new Id().value, [new Id().value])
      ).rejects.toThrow('Schedule not found');
    });
    it('should generate an error when trying to remove the lesson from schedule with the wrong lesson ID', async () => {
      await expect(
        repository.removeLessons(schedule1.id.value, [new Id().value])
      ).rejects.toThrow('This lesson is not included in the schedule');
    });

    it('should generate an error when trying to add the lesson to the schedule with the wrong lesson ID', async () => {
      await expect(
        repository.addLessons(schedule1.id.value, ['asdasd'])
      ).rejects.toThrow('Lesson id is not valid');
    });
  });

  describe('On success', () => {
    it('should find a schedule', async () => {
      const scheduleId = schedule1.id.value;
      const scheduleFound = await repository.find(scheduleId);

      expect(scheduleFound).toBeDefined();
      expect(scheduleFound!.id).toBeDefined();
      expect(scheduleFound!.student).toBe(schedule1.student);
      expect(scheduleFound!.curriculum).toBe(schedule1.curriculum);
      expect(scheduleFound!.lessonsList).toBe(schedule1.lessonsList);
    });
    it('should create a new schedule and return its id', async () => {
      const result = await repository.create(schedule3);

      expect(result).toBe(schedule3.id.value);
    });
    it('should update a schedule and return its new informations', async () => {
      const updatedSchedule: Schedule = schedule2;
      updatedSchedule.curriculum = new Id().value;

      const result = await repository.update(updatedSchedule);

      expect(result).toEqual(updatedSchedule);
    });
    it('should find all the schedules', async () => {
      const allSchedules = await repository.findAll();

      expect(allSchedules.length).toBe(2);
      expect(allSchedules[0].student).toBe(schedule1.student);
      expect(allSchedules[1].student).toBe(schedule2.student);
      expect(allSchedules[0].curriculum).toBe(schedule1.curriculum);
      expect(allSchedules[1].curriculum).toBe(schedule2.curriculum);
      expect(allSchedules[0].lessonsList).toBe(schedule1.lessonsList);
      expect(allSchedules[1].lessonsList).toBe(schedule2.lessonsList);
    });
    it('should remove the schedule', async () => {
      const response = await repository.delete(schedule1.id.value);

      expect(response).toBe('Operação concluída com sucesso');
    });

    it('should add a new student to the schedule', async () => {
      const response = await repository.addLessons(schedule1.id.value, [
        new Id().value,
      ]);

      expect(response).toBe('1 value was entered');
    });
    it('should remove a student from the schedule', async () => {
      const response = await repository.removeLessons(schedule1.id.value, [
        schedule1.lessonsList[0],
      ]);

      expect(response).toBe('1 value was removed');
    });
  });
});
