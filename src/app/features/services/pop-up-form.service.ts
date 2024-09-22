import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, FormGroup } from '@angular/forms';
import { PopUpData, PopUpGroup } from '../periodic-elements/components/popup/model/pop-up-form';
import { PeriodicElementControlType } from '../periodic-elements/components/popup/enum/popup-form-enum';

@Injectable({
  providedIn: 'root'
})
export class PopUpFormService {
  private _popUpForm?: FormGroup;

  private readonly formBuilder: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public get popUpForm(): FormGroup<PopUpGroup> | undefined {
    return this._popUpForm;
  }

  public prepareForm(popUpData: PopUpData): FormGroup<PopUpGroup> | undefined {
    switch (popUpData.editType) {
      case PeriodicElementControlType.POSITION:
        return (this._popUpForm = this.formBuilder.group<PopUpGroup>({
          [PeriodicElementControlType.POSITION]: this.formBuilder.control<number>(popUpData.element.position)
        }));
      case PeriodicElementControlType.NAME:
        return (this._popUpForm = this.formBuilder.group<PopUpGroup>({
          [PeriodicElementControlType.NAME]: this.formBuilder.control<string>(popUpData.element.name)
        }));
      case PeriodicElementControlType.WEIGHT:
        return (this._popUpForm = this.formBuilder.group<PopUpGroup>({
          [PeriodicElementControlType.WEIGHT]: this.formBuilder.control<number>(popUpData.element.weight)
        }));
      case PeriodicElementControlType.SYMBOL:
        return (this._popUpForm = this.formBuilder.group<PopUpGroup>({
          [PeriodicElementControlType.SYMBOL]: this.formBuilder.control<string>(popUpData.element.symbol)
        }));
      default:
        return;
    }
  }
}
