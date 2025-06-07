export {};

declare global {
  /** Dias da semana no formato reduzido (3 letras) */
  type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

  /** Hora no formato HH:mm */
  type Hour = `${string}:${string}`;
}
