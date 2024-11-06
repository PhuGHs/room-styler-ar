import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductStatusDirective } from '@app/directives/product-status.directive';
import { VndCurrencyPipe } from '@app/pipes/vnd-currency.pipe';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ProductStatusDirective, VndCurrencyPipe, RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

}
