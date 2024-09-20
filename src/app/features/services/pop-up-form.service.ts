import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators, FormControl, Form } from '@angular/forms';
import {
  NameForm,
  PeriodicElementForm,
  PopUpData,
  PositionForm,
  SymbolForm,
  WeightForm
} from '../periodic-elements/components/popup/model/pop-up-form';
import {
  PeriodicElementControlType,
  PeriodicElementEnum
} from '../periodic-elements/components/popup/enum/popup-form-enum';
import { PeriodicElement } from '../../@api/models/periodicElement';

@Injectable({
  providedIn: 'root'
})
export class PopUpFormService {
  public _popUpForm!: FormGroup;

  constructor(private readonly formBuilder: NonNullableFormBuilder) {}

  public fillPopUpForm(popUpData: PopUpData): FormGroup | undefined {
    switch (popUpData.editType) {
      case PeriodicElementControlType.POSITION:
        return (this._popUpForm = this.formBuilder.group<PositionForm>({
          [PeriodicElementControlType.POSITION]: this.formBuilder.control<number>(popUpData.element.position)
        }));
      case PeriodicElementControlType.NAME:
        return (this._popUpForm = this.formBuilder.group<NameForm>({
          [PeriodicElementControlType.NAME]: this.formBuilder.control<string>(popUpData.element.name)
        }));
      case PeriodicElementControlType.WEIGHT:
        return (this._popUpForm = this.formBuilder.group<WeightForm>({
          [PeriodicElementControlType.WEIGHT]: this.formBuilder.control<number>(popUpData.element.weight)
        }));
      case PeriodicElementControlType.SYMBOL:
        return (this._popUpForm = this.formBuilder.group<SymbolForm>({
          [PeriodicElementControlType.SYMBOL]: this.formBuilder.control<string>(popUpData.element.symbol)
        }));
      default:
        return;
    }
  }
}
