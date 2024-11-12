import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from '@app/models/Product';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SAMPLE_PRODUCT } from './product-details-page.config';
import { VndCurrencyPipe } from '@app/pipes/vnd-currency.pipe';
import { ProductImage } from '@app/models/Image';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ShowModelDialogComponent } from '@app/components/dialog/show-model-dialog/show-model-dialog.component';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, VndCurrencyPipe, MatTabsModule, MatDialogModule],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss'
})
export class ProductDetailsPageComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  product: Product = SAMPLE_PRODUCT;
  imageList: ProductImage[] = this.product.images;
  selectedImage: ProductImage = this.product.images[0];

  constructor(private matDialog: MatDialog) {

  }

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

  openModelDialog() {
    this.matDialog.open(ShowModelDialogComponent, {
      width: '80vw',
      height: '80vh'
    })
  }

  selectImage(item: ProductImage) {
    this.selectedImage = item;
  }
}
