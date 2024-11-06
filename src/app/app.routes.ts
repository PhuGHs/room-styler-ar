import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './modules/auth/login/login.component';

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
          then(m => m.HomepageComponent)
      },
      {
        path: 'products/:productId',
        loadComponent: () => import('./modules/user/product-details-page/product-details-page.component').then(m => m.ProductDetailsPageComponent)
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
