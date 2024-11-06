import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vndCurrency',
  standalone: true
})
export class VndCurrencyPipe implements PipeTransform {

  transform(value: number): String {
    if (!value && value !== 0) return '';

    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})
  }

}
