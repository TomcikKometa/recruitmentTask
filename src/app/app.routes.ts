import { Routes } from '@angular/router';
export enum RoutesPaths {
  PERIODIC_TABLE = 'periodic-table',
}
export const routes: Routes = [
  {
    path: RoutesPaths.PERIODIC_TABLE,
    loadComponent: () =>
      import(
        './features/periodic-elements/containers/periodic-table/periodic-table.component'
      ).then((c) => c.MainDashboardComponent),
  },
  {
    path: '**',
    redirectTo: RoutesPaths.PERIODIC_TABLE,
  },
];
