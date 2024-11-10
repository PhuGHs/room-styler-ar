import { Component, inject } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CATEGORY_COLUMN } from './category-management-page.config';
import { Category } from '@app/models/Category';

@Component({
  selector: 'app-category-management-page',
  standalone: true,
  imports: [MatTableModule, MatSortModule, CommonModule, MatPaginatorModule, MatSelectModule, BreadcrumbModule],
  templateUrl: './category-management-page.component.html',
  styleUrl: './category-management-page.component.scss'
})
export class CategoryManagementPageComponent {
  private _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['Image', 'Name', 'ID', 'Description', 'Actions'];
  categoriesTableData = new MatTableDataSource<Category>(CATEGORY_COLUMN);
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20];


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
