import { Routes } from '@angular/router';
export enum RoutesPaths {
  MAIN_DASHBOARD = 'mainDashboard',
}
export const routes: Routes = [
  {
    path: RoutesPaths.MAIN_DASHBOARD,
    loadComponent: () =>
      import(
        './features/periodic-elements/containers/main-dashboard/main-dashboard.component'
      ).then((c) => c.MainDashboardComponent),
  },
  {
    path: '**',
    redirectTo: RoutesPaths.MAIN_DASHBOARD,
  },
];
