export {};

declare global {
  /** Dias da semana no formato reduzido (3 letras) */
  type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

  /** Hora no formato HH:mm */
  type Hour = `${string}:${string}`;

  /** Enum com os papéis possíveis de usuário */
  enum RoleUsersEnum {
    MASTER = 'master',
    ADMINISTRATOR = 'administrator',
    TEACHER = 'teacher',
    WORKER = 'worker',
    STUDENT = 'student',
  }

  /** Tipo que representa qualquer valor do RoleUsersEnum */
  type RoleUsers = `${RoleUsersEnum}`;
}
