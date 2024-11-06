import { Component } from '@angular/core';
import { CategoryComponent } from '@app/components/category/category.component';
import { ProductComponent } from '@app/components/product/product.component';
import { Category } from '@app/models/Category';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CarouselModule, CategoryComponent, ProductComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  images = [
    { src: '/images/1.png', alt: 'image-1.png'},
    { src: '/images/2.png', alt: 'image-2.png'}
  ];

  categories: Category[] = [
    {
      categoryId: 1,
      categoryName: 'Chair',
      categoryDescription: 'An elegant carpet makes you look more luxurious',
      categoryImage: 'https://cb.scene7.com/is/image/Crate/cb_dSC_20241101_Furniture_DiningTables?bfc=on&wid=565&qlt=80'
    },
    {
      categoryId: 2,
      categoryName: 'Wardrobe',
      categoryDescription: 'An unlimited capacity for your clothes',
      categoryImage: 'https://cb.scene7.com/is/image/Crate/cb_dSC_20241101_Furniture_HomeOffice?bfc=on&wid=565&qlt=80&op_sharpen=1'
    }
  ];
}
