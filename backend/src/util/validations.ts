export function isNotEmpty(value: string): boolean {
  return value.length > 0;
}

export function isAlpha(value: string): boolean {
  const regexMatch = value.match(/^[a-zA-Z\s]+$/);
  return !!regexMatch;
}

export function maxLengthInclusive(value: string, maxlen: number): boolean {
  return value.length <= maxlen;
}

export function minLength(value: string, minlen: number): boolean {
  return value.length > minlen;
}

export function isNumeric(value: number): boolean {
  return typeof value === 'number';
}

export function isGreaterZero(value: number): boolean {
  return value > 0;
}

export function validCurrency(value: 'R$' | '€' | '$'): boolean {
  const validCurrencies: Array<'R$' | '€' | '$'> = ['R$', '€', '$'];
  if (!validCurrencies.includes(value)) {
    return false;
  } else {
    return true;
  }
}

export function validEmail(value: string): boolean {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function validDate(value: Date): boolean {
  if (!(value instanceof Date)) {
    return false;
  }
  const currentDate: Date = new Date();
  if (value > currentDate) {
    return false;
  }
  return true;
}

export function validCNPJ(value: string): boolean {
  value = value.replace(/\D/g, '');
  if (value.length !== 14) {
    return false;
  }
  if (/^(\d)\1+$/.test(value)) {
    return false;
  }
  return true;
}

export function validId(value: string): boolean {
  const regexMatch = value.match(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );
  return !!regexMatch;
}

export function areAllValuesUnique(arr: string[]): boolean {
  const set = new Set(arr);
  return set.size === arr.length;
}

export function validHour24h(value: string): boolean {
  const regex24h = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  return regex24h.test(value);
}

export function validDay(value: string) {
  return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(value);
}
