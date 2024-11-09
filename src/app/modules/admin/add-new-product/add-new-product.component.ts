import { Component } from '@angular/core';
import { ProductImageComponent } from '@app/components/product-image/product-image.component';
import { MatInputModule } from '@angular/material/input';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-add-new-product',
  standalone: true,
  imports: [ProductImageComponent, MatInputModule, BreadcrumbModule],
  templateUrl: './add-new-product.component.html',
  styleUrl: './add-new-product.component.scss'
})
export class AddNewProductComponent {

}
