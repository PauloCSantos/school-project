export function toIsoDate(d: Date | string): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function normalizeCurrency(currency?: 'R$' | '€' | '$'): 'R$' | '€' | '$' {
  return currency === '€' || currency === '$' ? currency : 'R$';
}

export function profileToRequest<
  T extends { birthday?: any; salary?: { salary: number; currency?: any } }
>(input: T): any {
  const payload: any = { ...input };
  if (payload.birthday) payload.birthday = toIsoDate(payload.birthday);
  if (payload.salary)
    payload.salary = { ...payload.salary, currency: normalizeCurrency(payload.salary.currency) };
  return payload;
}
