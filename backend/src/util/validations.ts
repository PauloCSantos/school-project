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

export function validBirthday(value: Date): boolean {
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
