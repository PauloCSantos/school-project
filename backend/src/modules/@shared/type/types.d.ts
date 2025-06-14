export {};

declare global {
  type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  type Hour = `${string}:${string}`;
}
