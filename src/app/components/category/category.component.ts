import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '@app/models/Category';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CardModule, ButtonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  @Input() category!: Category;

  constructor(private router: Router) {}
}
