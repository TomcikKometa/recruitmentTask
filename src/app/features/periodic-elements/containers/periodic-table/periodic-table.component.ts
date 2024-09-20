import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { MatButton } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { PopupComponent } from '../../components/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { PeriodicElementDataService } from '../../../services/periodic-element-data.service';
import { debounce, debounceTime, delay, distinctUntilChanged, first, Observable, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DIALOG_OPTIONS_POP_UP } from '../../../../@config/form-config';
import { PeriodicElement } from '../../../../@api/models/periodicElement';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly periodicElementDataService = inject(PeriodicElementDataService);

  protected displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  protected dataSource!: MatTableDataSource<PeriodicElement, MatPaginator>;
  protected isRendered: boolean = true;
  protected isLoading$: Observable<boolean> = this.periodicElementDataService.isLoading$;
  protected periodicElements$: Observable<PeriodicElement[]> = this.periodicElementDataService.periodicElements$;
  private readonly destroyReference: DestroyRef = inject(DestroyRef);

  private readonly dialog: MatDialog = inject(MatDialog);

  public ngOnInit(): void {
    this.periodicElementDataService.fetchPeriodicElements();

    this.filterControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyReference), debounceTime(2000))
      .subscribe((value: string) => {
        this.periodicElementDataService.filterPhrase = value;
      });
  }

  protected openDialog(element: PeriodicElement, editType: string) {
    this.dialog
      .open(PopupComponent, { ...DIALOG_OPTIONS_POP_UP, data: { element, editType } })
      .afterClosed()
      .pipe(first())
      .subscribe((value: Partial<PeriodicElement>) => {
        this.periodicElementDataService.editPeriodicElements(element.position, { ...element, ...value });
      });
  }
}
