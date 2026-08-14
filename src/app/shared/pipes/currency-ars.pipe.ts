import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({ name: 'currencyArs' })
export class CurrencyArsPipe implements PipeTransform {
  private readonly currencyPipe = new CurrencyPipe('es-AR');

  transform(value: number | null | undefined, decimals = '1.0-2'): string | null {
    if (value == null) return null;
    return this.currencyPipe.transform(value, 'ARS', 'symbol', decimals);
  }
}
