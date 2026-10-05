import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[appDateYmdMask]',
  standalone: true,
})
export class DateYmdMaskDirective {
  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() @Self() private ngControl?: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(_: Event) {
    const input = this.el.nativeElement;

    // Só dígitos, máximo 8 (YYYYMMDD)
    const digits = (input.value || '').replace(/\D/g, '').slice(0, 8);

    // Formata progressivamente como YYYY, YYYY-MM, YYYY-MM-DD
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);

    let out = y;
    if (m) out = `${y}-${m}`;
    if (d) out = `${y}-${m}-${d}`;

    // Valida a data completa (YYYY-MM-DD)
    if (out.length === 10) {
      if (!this.isValidDate(out)) {
        // Data inválida - limpa o input
        out = '';
      }
    }

    if (input.value !== out) {
      const atEnd = document.activeElement === input && input.selectionStart === input.value.length;
      input.value = out;
      if (atEnd && out.length > 0) {
        const len = out.length;
        try {
          input.setSelectionRange(len, len);
        } catch {}
      }
    }

    // Mantém o FormControl sincronizado
    const ctrl = (this.ngControl?.control as FormControl) || null;
    if (ctrl && ctrl.value !== out) {
      ctrl.setValue(out, { emitEvent: true, emitModelToViewChange: false });
      ctrl.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(_: Event) {
    const input = this.el.nativeElement;
    const value = input.value;

    // Se não está vazio e não tem 10 caracteres (formato incompleto), limpa
    if (value && value.length !== 10) {
      input.value = '';

      const ctrl = (this.ngControl?.control as FormControl) || null;
      if (ctrl) {
        ctrl.setValue('', { emitEvent: true, emitModelToViewChange: false });
        ctrl.updateValueAndValidity({ onlySelf: true, emitEvent: true });
      }
    }
  }

  private isValidDate(dateString: string): boolean {
    // Verifica se tem o formato correto YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const [year, month, day] = dateString.split('-').map(Number);

    // Validações básicas
    if (year < 1000 || year > 9999) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // Cria objeto Date para validação mais precisa
    const date = new Date(year, month - 1, day);

    // Verifica se a data é válida (não houve overflow)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }
}
