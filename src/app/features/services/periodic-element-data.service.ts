import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, finalize, first, map, Observable, switchMap, tap } from 'rxjs';
import { PeriodicElement } from '../../api/models/periodicElement';
import { ElementApiService } from '../../api/services/element-api.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodicElementDataService {
  private readonly _periodicElements: BehaviorSubject<PeriodicElement[]> = new BehaviorSubject<PeriodicElement[]>([]);
  private readonly _elementApiService: ElementApiService = inject(ElementApiService);
  private readonly _filterPhrase: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public set filterPhrase(value: string) {
    this._filterPhrase.next(value);
  }

  public get periodicElements$(): Observable<PeriodicElement[]> {
    return combineLatest([this._periodicElements.asObservable(), this._filterPhrase.asObservable()]).pipe(
      map(([periodicElements, filterPhrase]) => this.filterPeriodicElements(periodicElements, filterPhrase))
    );
  }

  public get isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
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

  public editPeriodicElements(position: number, periodcElement: PeriodicElement): void {
    this._elementApiService
      .editSinglePeriodicElement(position, periodcElement)
      .pipe(
        first(),
        switchMap(() => this.getPeriodicElementsFromApi()),
        finalize(() => this.isLoading.next(false))
      )
      .subscribe();
  }

  private getPeriodicElementsFromApi(): Observable<PeriodicElement[]> {
    return this._elementApiService.getPeriodicElements().pipe(
      tap((periodicElements: PeriodicElement[]) => {
        this._periodicElements.next(periodicElements);
      })
    );
  }

  private filterPeriodicElements(periodicElement: PeriodicElement[], filterPhrase: string): PeriodicElement[] {
    if (!filterPhrase) {
      return periodicElement;
    }
    return periodicElement.filter((periodicElement: PeriodicElement) => {
      return Object.values(periodicElement).find(value =>
        value.toString().toUpperCase().includes(filterPhrase.toUpperCase())
      );
    });
  }
}
