import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { MenuItem } from 'primeng/api';
import { PRODUCT_DATA, ProductColumns } from './product-management-page.config';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MatDialog } from '@angular/material/dialog';
import { ShowGalleryDialogComponent } from '@app/components/dialog/show-gallery-dialog/show-gallery-dialog.component';
import { ShowModelDialogComponent } from '@app/components/dialog/show-model-dialog/show-model-dialog.component';

@Component({
  selector: 'app-product-management-page',
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule, MatPaginatorModule, MatSelectModule, BreadcrumbModule, ShowGalleryDialogComponent],
  templateUrl: './product-management-page.component.html',
  styleUrl: './product-management-page.component.scss'
})
export class ProductManagementPageComponent implements AfterViewInit, OnInit {

  constructor(private matDialog: MatDialog) {

  }

  private _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['Name', 'ID', 'Price', 'Images', 'Model', 'Actions'];
  productsTableData = new MatTableDataSource<ProductColumns>(PRODUCT_DATA);
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20];

  items: MenuItem[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.productsTableData.sort = this.sort;
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Product & Category',
        routerLink: ['categories']
      },
      {
        label: 'Product Management'
      }
    ]
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openImageGallery(): void {
    this.matDialog.open(ShowGalleryDialogComponent);
  }

  openModelPage(): void {
    this.matDialog.open(ShowModelDialogComponent);
  }
}
