import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import initializeUserMaster from './setups/user-management/master.setup';
import initializeUserAdministrator from './setups/user-management/administrator.setup';
import initializeUserStudent from './setups/user-management/student.setup';
import initializeUserTeacher from './setups/user-management/teacher.setup';
import initializeUserWorker from './setups/user-management/worker.setup';
import initializeSubject from './setups/subject-curriculum-management/subject.setup';
import initializeCurriculum from './setups/subject-curriculum-management/curriculum.setup';
import initializeSchedule from './setups/schedule-lesson-management/schedule.setup';
import initializeLesson from './setups/schedule-lesson-management/lesson.setup';
import initializeEvent from './setups/event-calendar-management/event.setup';
import initializeEvaluation from './setups/evaluation-note-attendance-management/evaluation.setup';
import initializeNote from './setups/evaluation-note-attendance-management/note.setup';
import initializeAttendance from './setups/evaluation-note-attendance-management/attendance.setup';
import initializeAuthUser from './setups/authentication-authorization-management/user-facade.setup';

async function startServer() {
  const expressHttp = new ExpressHttp();
  initializeUserMaster(expressHttp);
  initializeUserAdministrator(expressHttp);
  initializeUserStudent(expressHttp);
  initializeUserTeacher(expressHttp);
  initializeUserWorker(expressHttp);
  initializeSubject(expressHttp);
  initializeCurriculum(expressHttp);
  initializeSchedule(expressHttp);
  initializeLesson(expressHttp);
  initializeEvent(expressHttp);
  initializeEvaluation(expressHttp);
  initializeNote(expressHttp);
  initializeAttendance(expressHttp);
  initializeAuthUser(expressHttp);
  expressHttp.listen(3003);
}

startServer();
