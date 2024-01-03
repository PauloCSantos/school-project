export function isNotEmpty(value: string): boolean {
  return value.length > 0;
}

export function isAlpha(value: string): boolean {
  const regexMatch = value.match(/^[a-zA-Z]+$/);
  return !!regexMatch;
}

export function maxLengthInclusive(value: string, maxlen: number): boolean {
  return value.length <= maxlen;
}

export function minLength(value: string, minlen: number): boolean {
  return value.length > minlen;
}

export function isNumeric(value: number): boolean {
  return !Number.isNaN(value);
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

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(value.charAt(i)) * (5 - (i % 4));
  }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(value.charAt(12)) !== digit) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(value.charAt(i)) * (6 - (i % 4));
  }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(value.charAt(13)) !== digit) {
    return false;
  }

  return true;
}
