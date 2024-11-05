import { Component } from '@angular/core';
import { CategoryComponent } from '@app/components/category/category.component';
import { Category } from '@app/models/Category';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CarouselModule, CategoryComponent],
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
      categoryDescription: 'This is a chair',
      categoryImage: 'https://winchair.vn/wp-content/uploads/2021/03/Ghe-Grado-chair-WC142-1.jpg'
    },
    {
      categoryId: 2,
      categoryName: 'Chair',
      categoryDescription: 'This is a chair',
      categoryImage: 'https://winchair.vn/wp-content/uploads/2021/03/Ghe-Grado-chair-WC142-1.jpg'
    },
    {
      categoryId: 3,
      categoryName: 'Chair',
      categoryDescription: 'This is a chair',
      categoryImage: 'https://winchair.vn/wp-content/uploads/2021/03/Ghe-Grado-chair-WC142-1.jpg'
    },
    {
      categoryId: 4,
      categoryName: 'Chair',
      categoryDescription: 'This is a chair',
      categoryImage: 'https://winchair.vn/wp-content/uploads/2021/03/Ghe-Grado-chair-WC142-1.jpg'
    }
  ];
}
