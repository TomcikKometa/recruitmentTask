import { FormControl } from '@angular/forms';
import { PeriodicElementControlType, PeriodicElementEnum } from '../enum/popup-form-enum';
import { PeriodicElement } from '../../../../../api/models/periodicElement';

export interface PopUpData {
  editType: string;
  element: PeriodicElement;
}

export interface PopUpGroup {
  [key:string]:FormControl<string | number>
}

export interface PositionForm {
  [PeriodicElementControlType.POSITION]: FormControl<number>;
}

export interface NameForm {
  [PeriodicElementControlType.NAME]: FormControl<string>;
}

export interface WeightForm {
  [PeriodicElementControlType.WEIGHT] : FormControl<number>;
}

export interface SymbolForm {
  [PeriodicElementControlType.SYMBOL] : FormControl<string>;
}

export interface PeriodicElementForm {
  [PeriodicElementEnum.TYPE]:FormControl<string>
}
