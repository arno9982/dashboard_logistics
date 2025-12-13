import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'deliveries',
    loadComponent: () => import('./deliveries/pages/deliveries-list/deliveries-list').then(m => m.DeliveriesListComponent)
  }
];
