import ExpressHttp from '@/infraestructure/http/express-http';
import CreateUserAdministrator from '@/application/usecases/user-management/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/application/usecases/user-management/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/application/usecases/user-management/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/application/usecases/user-management/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/application/usecases/user-management/administrator/updateUserAdministrator.usecase';
import CreateUserMaster from '@/application/usecases/user-management/master/createUserMaster.usecase';
import FindUserMaster from '@/application/usecases/user-management/master/findUserMaster.usecase';
import UpdateUserMaster from '@/application/usecases/user-management/master/updateUserMaster.usecase';
import CreateUserStudent from '@/application/usecases/user-management/student/createUserStudent.usecase';
import DeleteUserStudent from '@/application/usecases/user-management/student/deleteUserStudent.usecase';
import FindAllUserStudent from '@/application/usecases/user-management/student/findAllUserStudent.usecase';
import FindUserStudent from '@/application/usecases/user-management/student/findUserStudent.usecase';
import UpdateUserStudent from '@/application/usecases/user-management/student/updateUserStudent.usecase';
import CreateUserTeacher from '@/application/usecases/user-management/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '@/application/usecases/user-management/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '@/application/usecases/user-management/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '@/application/usecases/user-management/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '@/application/usecases/user-management/teacher/updateUserTeacher.usecase';
import CreateUserWorker from '@/application/usecases/user-management/worker/createUserWorker.usecase';
import DeleteUserWorker from '@/application/usecases/user-management/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '@/application/usecases/user-management/worker/findAllUserWorker.usecase';
import FindUserWorker from '@/application/usecases/user-management/worker/findUserWorker.usecase';
import UpdateUserWorker from '@/application/usecases/user-management/worker/updateUserWorker.usecase';
import MemoryUserAdministratorRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-administrator.repository';
import MemoryUserMasterRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-master.repository';
import MemoryUserStudentRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-student.repository';
import MemoryUserTeacherRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-teacher.repository';
import MemoryUserWorkerRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-worker.repository';
import { UserAdministratorController } from '@/interface/controller/user-management/user-administrator.controller';
import { UserMasterController } from '@/interface/controller/user-management/user-master.controller';
import { UserStudentController } from '@/interface/controller/user-management/user-student.controller';
import { UserTeacherController } from '@/interface/controller/user-management/user-teacher.controller';
import { UserWorkerController } from '@/interface/controller/user-management/user-worker.controller';
import { UserAdministratorRoute } from '@/interface/route/user-management/user-administrator.route';
import { UserMasterRoute } from '@/interface/route/user-management/user-master.route';
import { UserStudentRoute } from '@/interface/route/user-management/user-student.route';
import { UserTeacherRoute } from '@/interface/route/user-management/user-teacher.route';
import { UserWorkerRoute } from '@/interface/route/user-management/user-worker.route';
//-----------------------------------------------
import AddSubjects from '@/application/usecases/subject-curriculum-management/curriculum/addSubjects.usecase';
import CreateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/createCurriculum.usecase';
import DeleteCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/deleteCurriculum.usecase';
import FindAllCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findAllCurriculum.usecase';
import FindCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findCurriculum.usecase';
import RemoveSubjects from '@/application/usecases/subject-curriculum-management/curriculum/removeSubjects.usecase';
import UpdateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/updateCurriculum.usecase';
import CreateSubject from '@/application/usecases/subject-curriculum-management/subject/createSubject.usecase';
import DeleteSubject from '@/application/usecases/subject-curriculum-management/subject/deleteSubject.usecase';
import FindAllSubject from '@/application/usecases/subject-curriculum-management/subject/findAllSubject.usecase';
import FindSubject from '@/application/usecases/subject-curriculum-management/subject/findSubject.usecase';
import UpdateSubject from '@/application/usecases/subject-curriculum-management/subject/updateSubject.usecase';
import MemoryCurriculumRepository from '@/infraestructure/repositories/subject-curriculum-management/memory-repository/curriculum.repository';
import MemorySubjectRepository from '@/infraestructure/repositories/subject-curriculum-management/memory-repository/subject.repository';
import { CurriculumController } from '@/interface/controller/subject-curriculum-management/curriculum.controller';
import { SubjectController } from '@/interface/controller/subject-curriculum-management/subject.controller';
import { CurriculumRoute } from '@/interface/route/subject-curriculum-management/curriculum.route';
import { SubjectRoute } from '@/interface/route/subject-curriculum-management/subject.route';
//------------------------------------------
import AddDay from '@/application/usecases/schedule-lesson-management/lesson/addDay.usecase';
import AddStudents from '@/application/usecases/schedule-lesson-management/lesson/addStudents.usecase';
import AddTime from '@/application/usecases/schedule-lesson-management/lesson/addTime.usecase';
import CreateLesson from '@/application/usecases/schedule-lesson-management/lesson/createLesson.usecase';
import DeleteLesson from '@/application/usecases/schedule-lesson-management/lesson/deleteLesson.usecase';
import FindAllLesson from '@/application/usecases/schedule-lesson-management/lesson/findAllLesson.usecase';
import FindLesson from '@/application/usecases/schedule-lesson-management/lesson/findLesson.usecase';
import RemoveDay from '@/application/usecases/schedule-lesson-management/lesson/removeDay.usecase';
import RemoveStudents from '@/application/usecases/schedule-lesson-management/lesson/removeStudents.usecase';
import RemoveTime from '@/application/usecases/schedule-lesson-management/lesson/removeTime.usecase';
import UpdateLesson from '@/application/usecases/schedule-lesson-management/lesson/updateLesson.usecase';
import AddLessons from '@/application/usecases/schedule-lesson-management/schedule/addLessons.usecase';
import CreateSchedule from '@/application/usecases/schedule-lesson-management/schedule/createSchedule.usecase';
import DeleteSchedule from '@/application/usecases/schedule-lesson-management/schedule/deleteSchedule.usecase';
import FindAllSchedule from '@/application/usecases/schedule-lesson-management/schedule/findAllSchedule.usecase';
import FindSchedule from '@/application/usecases/schedule-lesson-management/schedule/findSchedule.usecase';
import RemoveLessons from '@/application/usecases/schedule-lesson-management/schedule/removeLessons.usecase';
import UpdateSchedule from '@/application/usecases/schedule-lesson-management/schedule/updateSchedule.usecase';
import MemoryLessonRepository from '@/infraestructure/repositories/schedule-lesson-management/memory-repository/lesson.repository';
import MemoryScheduleRepository from '@/infraestructure/repositories/schedule-lesson-management/memory-repository/schedule.repository';
import { LessonController } from '@/interface/controller/schedule-lesson-management/lesson.controller';
import { ScheduleController } from '@/interface/controller/schedule-lesson-management/schedule.controller';
import { LessonRoute } from '@/interface/route/schedule-lesson-management/lesson.route';
import { ScheduleRoute } from '@/interface/route/schedule-lesson-management/schedule.route';
//---------------------------------
import CreateEvent from '@/application/usecases/event-calendar-management/event/createEvent.usecase';
import DeleteEvent from '@/application/usecases/event-calendar-management/event/deleteEvent.usecase';
import FindAllEvent from '@/application/usecases/event-calendar-management/event/findAllEvent.usecase';
import FindEvent from '@/application/usecases/event-calendar-management/event/findEvent.usecase';
import UpdateEvent from '@/application/usecases/event-calendar-management/event/updateEvent.usecase';
import MemoryEventRepository from '@/infraestructure/repositories/event-calendar-management/memory-repository/event.repository';
import { EventController } from '@/interface/controller/event-calendar-management/event.controller';
import { EventRoute } from '@/interface/route/event-calendar-management/event.route';
//----------------------------------------------
import AddStudentsAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/addStudents.usecase';
import CreateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/createAttendance.usecase';
import DeleteAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/deleteAttendance.usecase';
import FindAllAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/findAllAttendance.usecase';
import FindAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/findAttendance.usecase';
import RemoveStudentsAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/removeStudents.usecase';
import UpdateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/updateAttendance.usecase';
import CreateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/createEvaluation.usecase';
import DeleteEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/deleteEvaluation.usecase';
import FindAllEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findAllEvaluation.usecase';
import FindEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findEvaluation.usecase';
import UpdateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/updateEvaluation.usecase';
import CreateNote from '@/application/usecases/evaluation-note-attendance-management/note/createNote.usecase';
import DeleteNote from '@/application/usecases/evaluation-note-attendance-management/note/deleteNote.usecase';
import FindAllNote from '@/application/usecases/evaluation-note-attendance-management/note/findAllNote.usecase';
import FindNote from '@/application/usecases/evaluation-note-attendance-management/note/findNote.usecase';
import UpdateNote from '@/application/usecases/evaluation-note-attendance-management/note/updateNote.usecase';
import MemoryAttendanceRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/attendance.repository';
import MemoryEvaluationRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/evaluation.repository';
import MemoryNoteRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/note.repository';
import { AttendanceController } from '@/interface/controller/evaluation-note-attendance-management/attendance.controller';
import { EvaluationController } from '@/interface/controller/evaluation-note-attendance-management/evaluation.controller';
import { NoteController } from '@/interface/controller/evaluation-note-attendance-management/note.controller';
import { AttendanceRoute } from '@/interface/route/evaluation-note-attendance-management/attendance.route';
import { EvaluationRoute } from '@/interface/route/evaluation-note-attendance-management/evaluation.route';
import { NoteRoute } from '@/interface/route/evaluation-note-attendance-management/note.route';

async function startServer() {
  const expressHttp = new ExpressHttp();

  const userAdministratorRepository = new MemoryUserAdministratorRepository();
  const userMasterRepository = new MemoryUserMasterRepository();
  const userStudentRepository = new MemoryUserStudentRepository();
  const userTeacherRepository = new MemoryUserTeacherRepository();
  const userWorkerRepository = new MemoryUserWorkerRepository();

  const createUserAdministratorUsecase = new CreateUserAdministrator(
    userAdministratorRepository
  );
  const findUserAdministratorUsecase = new FindUserAdministrator(
    userAdministratorRepository
  );
  const findAllUserAdministratorUsecase = new FindAllUserAdministrator(
    userAdministratorRepository
  );
  const updateUserAdministratorUsecase = new UpdateUserAdministrator(
    userAdministratorRepository
  );
  const deleteUserAdministratorUsecase = new DeleteUserAdministrator(
    userAdministratorRepository
  );
  const createUserMasterUsecase = new CreateUserMaster(userMasterRepository);
  const findUserMasterUsecase = new FindUserMaster(userMasterRepository);
  const updateUserMasterUsecase = new UpdateUserMaster(userMasterRepository);

  const createUserStudentUsecase = new CreateUserStudent(userStudentRepository);
  const findUserStudentUsecase = new FindUserStudent(userStudentRepository);
  const findAllUserStudentUsecase = new FindAllUserStudent(
    userStudentRepository
  );
  const updateUserStudentUsecase = new UpdateUserStudent(userStudentRepository);
  const deleteUserStudentUsecase = new DeleteUserStudent(userStudentRepository);

  const createUserTeacherUsecase = new CreateUserTeacher(userTeacherRepository);
  const findUserTeacherUsecase = new FindUserTeacher(userTeacherRepository);
  const findAllUserTeacherUsecase = new FindAllUserTeacher(
    userTeacherRepository
  );
  const updateUserTeacherUsecase = new UpdateUserTeacher(userTeacherRepository);
  const deleteUserTeacherUsecase = new DeleteUserTeacher(userTeacherRepository);

  const createUserWorkerUsecase = new CreateUserWorker(userWorkerRepository);
  const findUserWorkerUsecase = new FindUserWorker(userWorkerRepository);
  const findAllUserWorkerUsecase = new FindAllUserWorker(userWorkerRepository);
  const updateUserWorkerUsecase = new UpdateUserWorker(userWorkerRepository);
  const deleteUserWorkerUsecase = new DeleteUserWorker(userWorkerRepository);

  const userAdministratorController = new UserAdministratorController(
    createUserAdministratorUsecase,
    findUserAdministratorUsecase,
    findAllUserAdministratorUsecase,
    updateUserAdministratorUsecase,
    deleteUserAdministratorUsecase
  );
  const userMasterController = new UserMasterController(
    createUserMasterUsecase,
    findUserMasterUsecase,
    updateUserMasterUsecase
  );
  const userStudentController = new UserStudentController(
    createUserStudentUsecase,
    findUserStudentUsecase,
    findAllUserStudentUsecase,
    updateUserStudentUsecase,
    deleteUserStudentUsecase
  );
  const userTeacherController = new UserTeacherController(
    createUserTeacherUsecase,
    findUserTeacherUsecase,
    findAllUserTeacherUsecase,
    updateUserTeacherUsecase,
    deleteUserTeacherUsecase
  );
  const userWorkerController = new UserWorkerController(
    createUserWorkerUsecase,
    findUserWorkerUsecase,
    findAllUserWorkerUsecase,
    updateUserWorkerUsecase,
    deleteUserWorkerUsecase
  );

  const userAdministratorRoute = new UserAdministratorRoute(
    userAdministratorController,
    expressHttp
  );
  const userMasterRoute = new UserMasterRoute(
    userMasterController,
    expressHttp
  );
  const userStudentRoute = new UserStudentRoute(
    userStudentController,
    expressHttp
  );
  const userTeacherRoute = new UserTeacherRoute(
    userTeacherController,
    expressHttp
  );
  const userWorkerRoute = new UserWorkerRoute(
    userWorkerController,
    expressHttp
  );

  //---------------------------------------------------------------------------------------
  const subjectRepository = new MemorySubjectRepository();
  const curriculumRepository = new MemoryCurriculumRepository();

  const createSubjectUsecase = new CreateSubject(subjectRepository);
  const findSubjectUsecase = new FindSubject(subjectRepository);
  const findAllSubjectUsecase = new FindAllSubject(subjectRepository);
  const updateSubjectUsecase = new UpdateSubject(subjectRepository);
  const deleteSubjectUsecase = new DeleteSubject(subjectRepository);

  const createCurriculumUsecase = new CreateCurriculum(curriculumRepository);
  const findCurriculumUsecase = new FindCurriculum(curriculumRepository);
  const findAllCurriculumUsecase = new FindAllCurriculum(curriculumRepository);
  const updateCurriculumUsecase = new UpdateCurriculum(curriculumRepository);
  const deleteCurriculumUsecase = new DeleteCurriculum(curriculumRepository);
  const addSubjects = new AddSubjects(curriculumRepository);
  const removeSubjects = new RemoveSubjects(curriculumRepository);

  const subjectController = new SubjectController(
    createSubjectUsecase,
    findSubjectUsecase,
    findAllSubjectUsecase,
    updateSubjectUsecase,
    deleteSubjectUsecase
  );
  const curriculumController = new CurriculumController(
    createCurriculumUsecase,
    findCurriculumUsecase,
    findAllCurriculumUsecase,
    updateCurriculumUsecase,
    deleteCurriculumUsecase,
    addSubjects,
    removeSubjects
  );

  const subjectRoute = new SubjectRoute(subjectController, expressHttp);
  const curriculumRoute = new CurriculumRoute(
    curriculumController,
    expressHttp
  );
  //------------------------------------------
  const scheduleRepository = new MemoryScheduleRepository();
  const lessonRepository = new MemoryLessonRepository();

  const createScheduleUsecase = new CreateSchedule(scheduleRepository);
  const findScheduleUsecase = new FindSchedule(scheduleRepository);
  const findAllScheduleUsecase = new FindAllSchedule(scheduleRepository);
  const updateScheduleUsecase = new UpdateSchedule(scheduleRepository);
  const deleteScheduleUsecase = new DeleteSchedule(scheduleRepository);
  const addLessons = new AddLessons(scheduleRepository);
  const removeLessons = new RemoveLessons(scheduleRepository);

  const createLessonUsecase = new CreateLesson(lessonRepository);
  const findLessonUsecase = new FindLesson(lessonRepository);
  const findAllLessonUsecase = new FindAllLesson(lessonRepository);
  const updateLessonUsecase = new UpdateLesson(lessonRepository);
  const deleteLessonUsecase = new DeleteLesson(lessonRepository);
  const addStudents = new AddStudents(lessonRepository);
  const removeStudents = new RemoveStudents(lessonRepository);
  const addDay = new AddDay(lessonRepository);
  const removeDay = new RemoveDay(lessonRepository);
  const addTime = new AddTime(lessonRepository);
  const removeTime = new RemoveTime(lessonRepository);

  const scheduleController = new ScheduleController(
    createScheduleUsecase,
    findScheduleUsecase,
    findAllScheduleUsecase,
    updateScheduleUsecase,
    deleteScheduleUsecase,
    addLessons,
    removeLessons
  );
  const lessonController = new LessonController(
    createLessonUsecase,
    findLessonUsecase,
    findAllLessonUsecase,
    updateLessonUsecase,
    deleteLessonUsecase,
    addStudents,
    removeStudents,
    addDay,
    removeDay,
    addTime,
    removeTime
  );

  const scheduleRoute = new ScheduleRoute(scheduleController, expressHttp);
  const lessonRoute = new LessonRoute(lessonController, expressHttp);

  //-----------------------------------------------------
  const eventRepository = new MemoryEventRepository();

  const createEventUsecase = new CreateEvent(eventRepository);
  const findEventUsecase = new FindEvent(eventRepository);
  const findAllEventUsecase = new FindAllEvent(eventRepository);
  const updateEventUsecase = new UpdateEvent(eventRepository);
  const deleteEventUsecase = new DeleteEvent(eventRepository);

  const eventController = new EventController(
    createEventUsecase,
    findEventUsecase,
    findAllEventUsecase,
    updateEventUsecase,
    deleteEventUsecase
  );

  const eventRoute = new EventRoute(eventController, expressHttp);
  //--------------------------------
  const evaluationRepository = new MemoryEvaluationRepository();
  const noteRepository = new MemoryNoteRepository();
  const attendanceRepository = new MemoryAttendanceRepository();

  const createEvaluationUsecase = new CreateEvaluation(evaluationRepository);
  const findEvaluationUsecase = new FindEvaluation(evaluationRepository);
  const findAllEvaluationUsecase = new FindAllEvaluation(evaluationRepository);
  const updateEvaluationUsecase = new UpdateEvaluation(evaluationRepository);
  const deleteEvaluationUsecase = new DeleteEvaluation(evaluationRepository);

  const createNoteUsecase = new CreateNote(noteRepository);
  const findNoteUsecase = new FindNote(noteRepository);
  const findAllNoteUsecase = new FindAllNote(noteRepository);
  const updateNoteUsecase = new UpdateNote(noteRepository);
  const deleteNoteUsecase = new DeleteNote(noteRepository);

  const createAttendanceUsecase = new CreateAttendance(attendanceRepository);
  const findAttendanceUsecase = new FindAttendance(attendanceRepository);
  const findAllAttendanceUsecase = new FindAllAttendance(attendanceRepository);
  const updateAttendanceUsecase = new UpdateAttendance(attendanceRepository);
  const deleteAttendanceUsecase = new DeleteAttendance(attendanceRepository);
  const addStudentsAttendance = new AddStudentsAttendance(attendanceRepository);
  const removeStudentsAttendance = new RemoveStudentsAttendance(
    attendanceRepository
  );

  const evaluationController = new EvaluationController(
    createEvaluationUsecase,
    findEvaluationUsecase,
    findAllEvaluationUsecase,
    updateEvaluationUsecase,
    deleteEvaluationUsecase
  );
  const noteController = new NoteController(
    createNoteUsecase,
    findNoteUsecase,
    findAllNoteUsecase,
    updateNoteUsecase,
    deleteNoteUsecase
  );
  const attendanceController = new AttendanceController(
    createAttendanceUsecase,
    findAttendanceUsecase,
    findAllAttendanceUsecase,
    updateAttendanceUsecase,
    deleteAttendanceUsecase,
    addStudentsAttendance,
    removeStudentsAttendance
  );

  const evaluationRoute = new EvaluationRoute(
    evaluationController,
    expressHttp
  );
  const noteRoute = new NoteRoute(noteController, expressHttp);
  const attendanceRoute = new AttendanceRoute(
    attendanceController,
    expressHttp
  );

  //--------------------
  userAdministratorRoute.routes();
  userMasterRoute.routes();
  userStudentRoute.routes();
  userTeacherRoute.routes();
  userWorkerRoute.routes();
  //--------------------------------------
  subjectRoute.routes();
  curriculumRoute.routes();
  //------------------------------
  scheduleRoute.routes();
  lessonRoute.routes();
  //---------------------------
  eventRoute.routes();
  //--------------------------------
  evaluationRoute.routes();
  noteRoute.routes();
  attendanceRoute.routes();

  expressHttp.listen(3003);
}

startServer();
