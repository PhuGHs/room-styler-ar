import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from '@app/models/Product';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SAMPLE_PRODUCT } from './product-details-page.config';
import { VndCurrencyPipe } from '@app/pipes/vnd-currency.pipe';
import { ProductImage } from '@app/models/Image';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, VndCurrencyPipe, MatTabsModule],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss'
})
export class ProductDetailsPageComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  product: Product = SAMPLE_PRODUCT;
  imageList: ProductImage[] = this.product.images;
  selectedImage: ProductImage = this.product.images[0];

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        routerLink: '/'
      },
      {
        label: 'Chair',
        routerLink: '/category'
      },
      {
        label: 'Product details'
      }
    ]
  }

  selectImage(item: ProductImage) {
    this.selectedImage = item;
  }
}
