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
  },
      {
    path: 'reports',
    loadComponent: () => import('./reports/pages/reports/reports').then(m => m.ReportsComponent)
  },
   {
    path: 'couriers',
    loadComponent: () => import('./couriers/pages/couriers-list/couriers-list').then(m => m.CouriersComponent)
  },
  
   {
    path: 'tracking',
    loadComponent: () => import('./tracking/pages/live-tracking/live-tracking').then(m => m.DeliveryTrackingComponent)
  },
];
