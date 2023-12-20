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
