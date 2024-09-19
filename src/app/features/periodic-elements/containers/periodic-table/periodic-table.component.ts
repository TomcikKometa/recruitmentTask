import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { MatButton } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { PeriodicElement } from '../../../../api/models/periodicElement';
import { PopupComponent } from '../../components/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { PeriodicElementDataService } from '../../../services/periodic-element-data.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [MatTableModule, LottieComponent, MatButton, PopupComponent, CommonModule,MatIconModule],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss'
})
export class MainDashboardComponent implements OnInit {
  protected options: AnimationOptions = {
    path: '/assets/animations/loading.json',
    loop: true,
    autoplay: true
  };
  color1= '#f3f4f6'
  color2= 'linear-gradient(37deg, rgba(255,255,255,1) 0%, rgba(243,244,246,1) 12%, rgba(156,163,175,1) 100%, rgba(156,163,175,1) 100%)'
  private readonly periodicElementDataService = inject(PeriodicElementDataService);

  protected displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
  protected dataSource!: MatTableDataSource<PeriodicElement, MatPaginator>;
  protected isRendered: boolean = true;
  protected isLoading$: Observable<boolean> = this.periodicElementDataService.isLoading$;
  protected periodicElements$: Observable<PeriodicElement[]> = this.periodicElementDataService.periodicElements$;

  private readonly dialog: MatDialog = inject(MatDialog);

  public ngOnInit(): void {
    this.periodicElementDataService.fetchPeriodicElements();
  }

  protected openDialog() {
    this.dialog.open(PopupComponent, {});
  }

}
