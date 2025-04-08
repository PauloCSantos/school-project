export function isNotEmpty(value: string): boolean {
  return typeof value === 'string' && value.length > 0;
}

export function isAlpha(value: string): boolean {
  return typeof value === 'string' && /^[a-zA-Z\s]+$/.test(value);
}

export function maxLengthInclusive(value: string, maxlen: number): boolean {
  return typeof value === 'string' && value.length <= maxlen;
}

export function minLength(value: string, minlen: number): boolean {
  return typeof value === 'string' && value.length >= minlen;
}

export function isNumeric(value: number): boolean {
  return typeof value === 'number';
}

export function isGreaterZero(value: number): boolean {
  return typeof value === 'number' && value > 0;
}

export function validCurrency(value: 'R$' | '€' | '$'): boolean {
  return typeof value === 'string' && ['R$', '€', '$'].includes(value);
}

export function validEmail(value: string): boolean {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validDate(value: Date): boolean {
  return (
    value instanceof Date && !isNaN(value.getTime()) && value <= new Date()
  );
}

export function validCNPJ(value: string): boolean {
  if (typeof value !== 'string') return false;
  value = value.replace(/\D/g, '');
  if (value.length !== 14 || /^(\d)\1+$/.test(value)) return false;
  return true;
}

export function validId(value: string): boolean {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

export function areAllValuesUnique(arr: string[]): boolean {
  return new Set(arr).size === arr.length;
}

export function validHour24h(value: string): boolean {
  return (
    typeof value === 'string' &&
    /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value)
  );
}

export function validDay(value: string): boolean {
  return (
    typeof value === 'string' &&
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(value)
  );
}

export function validNote(value: number): boolean {
  return typeof value === 'number' && value >= 0 && value <= 10;
}

export function isString(value: string): boolean {
  return typeof value === 'string';
}

export function validRole(value: string): boolean {
  return (
    typeof value === 'string' &&
    ['master', 'administrator', 'teacher', 'worker', 'student'].includes(value)
  );
}
