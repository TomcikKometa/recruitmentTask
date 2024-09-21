import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PopUpData } from './model/pop-up-form';
import { PopUpFormService } from '../../../services/pop-up-form.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElementControlType } from './enum/popup-form-enum';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatDialogClose, MatInputModule, MatButtonModule, MatDialogActions,MatDialogModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements OnInit {
  protected popUpForm?: FormGroup;
  protected readonly periodicElementControlType: typeof PeriodicElementControlType = PeriodicElementControlType;
  protected controlType: string = '';
  protected inputType: 'text' | 'number' = 'text';
  protected label: string = '';

  protected readonly matDialogRef: MatDialogRef<PopupComponent> = inject(MatDialogRef);
  protected readonly data: PopUpData = inject(MAT_DIALOG_DATA);
  private readonly popFormService: PopUpFormService = inject(PopUpFormService);

  ngOnInit(): void {
    this.data ? this.popUpForm = this.popFormService.prepareForm(this.data) : '';
    switch (this.data.editType) {
      case PeriodicElementControlType.NAME:
        this.controlType = PeriodicElementControlType.NAME;
        this.inputType = 'text';
        this.label = 'Name';
        break;
      case PeriodicElementControlType.POSITION:
        this.controlType = PeriodicElementControlType.POSITION;
        this.inputType = 'number';
        this.label = 'Position';
        break;
    }
  }

  protected save(): void {
    this.matDialogRef.close(this.popUpForm?.value);
  }
}
