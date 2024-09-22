import { FormControl } from '@angular/forms';
import { PeriodicElement } from '../../../../../api/models/periodicElement';

export interface PopUpData {
  editType: string;
  element: PeriodicElement;
}

export interface PopUpGroup {
  [key:string]:FormControl<string | number>
}