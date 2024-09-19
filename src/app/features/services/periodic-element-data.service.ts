import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, first, Observable, switchMap, tap } from 'rxjs';
import { PeriodicElement } from '../../api/models/periodicElement';
import { ElementApiService } from '../../api/services/element-api.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodicElementDataService {
  private readonly periodicElements: BehaviorSubject<PeriodicElement[]> = new BehaviorSubject<PeriodicElement[]>([]);
  private readonly elementApiService: ElementApiService = inject(ElementApiService);

  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get isLoading$() : Observable<boolean> {
    return this.isLoading.asObservable()
  } 

  public get periodicElements$(): Observable<PeriodicElement[]> {
    return this.periodicElements.asObservable();
  }

  public fetchPeriodicElements(): void {
    this.isLoading.next(true);
    this.getPeriodicElementsFromApi()
      .pipe(
        first(),
        finalize(() => this.isLoading.next(false))
      )
      .subscribe();
  }

  public editPeriodicElements(periodcElement: PeriodicElement): void {
    this.isLoading.next(true);
    this.elementApiService
      .editSinglePeriodicElement(periodcElement)
      .pipe(
        first(),
        switchMap(() => this.getPeriodicElementsFromApi()),
        finalize(() => this.isLoading.next(false))
      )
      .subscribe();
  }

  private getPeriodicElementsFromApi(): Observable<PeriodicElement[]> {
    return this.elementApiService.getPeriodicElements().pipe(
      tap((periodicElements: PeriodicElement[]) => {
        this.periodicElements.next(periodicElements);
      })
    );
  }
}
