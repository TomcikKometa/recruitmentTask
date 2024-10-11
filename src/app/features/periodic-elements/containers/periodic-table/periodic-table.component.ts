import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { MatButton } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { PopupComponent } from '../../components/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, filter, Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DIALOG_OPTIONS_POP_UP } from '../../../../config/form-config';
import { PeriodicElement } from '../../../../api/models/periodicElement';
import { PeriodicElementStateService } from '../../../services/periodic-element-state.service';

export enum EditType {
  NAME = 'name',
  SYMBOL = 'symbol',
  WEIGHT = 'weight',
  POSITION = 'position'
}
@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    MatTableModule,
    LottieComponent,
    MatButton,
    PopupComponent,
    CommonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss'
})
export class MainDashboardComponent implements OnInit {
  protected options: AnimationOptions = {
    path: '/assets/animations/loading.json',
    loop: true,
    autoplay: true
  };
  protected readonly filterControl: FormControl = new FormControl('');
  private readonly periodicElementStateService = inject(PeriodicElementStateService);

  protected displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  protected dataSource!: MatTableDataSource<PeriodicElement, MatPaginator>;
  protected isRendered: boolean = true;
  protected isLoading$: Observable<boolean> = this.periodicElementStateService.isLoading$;
  protected periodicElements$: Observable<PeriodicElement[]> = this.periodicElementStateService.periodicElements$;

  private readonly destroyReference: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);

  public ngOnInit(): void {
    this.periodicElementStateService.fetchPeriodicElements();

    this.filterControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyReference), debounceTime(2000))
      .subscribe((value: string) => {
        this.periodicElementStateService.filterPhrase = value;
      });
  }

  protected openDialog(element: PeriodicElement, editType: string) {
    this.dialog
      .open(PopupComponent, { ...DIALOG_OPTIONS_POP_UP, data: { element, editType } })
      .afterClosed()
      .pipe(
        take(1),
        filter((value: Partial<PeriodicElement>) => !!value)
      )
      .subscribe(value => {
        this.periodicElementStateService.editPeriodicElements(element.position, { ...element, ...value });
      });
  }
}
