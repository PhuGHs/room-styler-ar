import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavButton, NavButtonComponent } from '../nav-button/nav-button.component';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavButtonComponent, NavButtonComponent, TooltipModule, RouterModule, BreadcrumbComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  items: NavButton[] = [
    {
      icon: 'pi pi-chevron-right',
      input: 'Product & Category',
      selectedIcon: 'pi pi-chevron-down',
      routerLink: 'categories'
    },
    {
      icon: 'pi pi-chevron-right',
      input: 'Furniture Virtual Room',
      selectedIcon: 'pi pi-chevron-down',
      routerLink: 'furniture-vr'
    }
  ]
}
