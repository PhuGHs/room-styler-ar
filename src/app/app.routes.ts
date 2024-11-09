import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./modules/user/homepage/homepage.component').
          then(m => m.HomepageComponent),
        data: { breadcrumb: 'Home'}
      },
      {
        path: 'products/:productId',
        loadComponent: () => import('./modules/user/product-details-page/product-details-page.component').then(m => m.ProductDetailsPageComponent),
        data: { breadcrumb: 'Product details'}
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'categories',
        loadComponent: () => import('./modules/admin/category-management-page/category-management-page.component').then(m => m.CategoryManagementPageComponent),
        data: { breadcrumb: 'Category & Product'},
      },
      {
        path: 'categories/:id',
        loadComponent: () => import('./modules/admin/product-management-page/product-management-page.component').then(m => m.ProductManagementPageComponent),
        data: { breadcrumb: 'Products'}
      },
      {
        path: 'products/add-new-product',
        loadComponent: () => import('./modules/admin/add-new-product/add-new-product.component').then(m => m.AddNewProductComponent),
        data: { breadcrumb: 'Products'}
      },
      {
        path: 'furniture-vr',
        loadComponent: () => import('./modules/admin/furniture-virtual-room/furniture-virtual-room.component').then(m => m.FurnitureVirtualRoomComponent),
        data: { breadcrumb: 'Furniture Virtual Room'}
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
