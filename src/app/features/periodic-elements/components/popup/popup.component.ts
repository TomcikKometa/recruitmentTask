import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { PopUpData } from './model/pop-up-form';
import { PopUpFormService } from '../../../services/pop-up-form.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElementControlType } from './enum/popup-form-enum';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogActions],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements OnInit {
  protected popUpForm!: FormGroup | undefined;

  protected readonly matDialogRef: MatDialogRef<PopupComponent> = inject(MatDialogRef);
  protected readonly data: PopUpData = inject(MAT_DIALOG_DATA);
  private readonly popFormService: PopUpFormService = inject(PopUpFormService);

  ngOnInit(): void {
    this.popUpForm = this.popFormService.fillPopUpForm(this.data);
  }

  protected get periodicElementControlType(): typeof PeriodicElementControlType {
    return PeriodicElementControlType;
  }

  protected save(): void {
    this.matDialogRef.close(this.popUpForm?.value)
  }
}
