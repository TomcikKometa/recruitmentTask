import { inject, Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { combineLatest, exhaustMap, finalize, first, map, Observable, switchMap, tap } from 'rxjs';
import { rxActions } from '@rx-angular/state/actions';
import { PeriodicElement } from '../../api/models/periodicElement';
import { ElementApiService } from '../../api/services/element-api.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodicElementStateService {
  private readonly elementApiService: ElementApiService = inject(ElementApiService);

  private state = rxState<{
    periodicElements: PeriodicElement[];
    filterPhrase: string;
    isLoading: boolean;
    error: boolean;
  }>(({ set }) => {
    set({ periodicElements: [], isLoading: false, filterPhrase: '', error: false });
  });

  actions = rxActions<{
    fetchPeriodicElements: void;
    editPeriodicElements: { position: number; periodcElement: PeriodicElement };
  }>();

  constructor() {
    this.actions.onFetchPeriodicElements(
      fetch$ =>
        fetch$.pipe(
          tap(() => this.state.set({ isLoading: true })),
          exhaustMap(() => this.elementApiService.getPeriodicElements())
        ),
      (periodicElement: PeriodicElement[]) => this.state.set({ periodicElements: periodicElement, isLoading: false })
    );

    this.actions.onEditPeriodicElements(
      request$ =>
        request$.pipe(
          tap(() => this.state.set({ isLoading: true })),
          exhaustMap(request =>
            this.elementApiService
              .editSinglePeriodicElement(request.position, request.periodcElement)
              .pipe(switchMap(() => this.elementApiService.getPeriodicElements()))
          )
        ),
      (periodcElements: PeriodicElement[]) => this.state.set({ periodicElements: periodcElements, isLoading: false })
    );
  }

  public get periodicElements$(): Observable<PeriodicElement[]> {
    return combineLatest([this.state.select('periodicElements'), this.state.select('filterPhrase')]).pipe(
      map(([periodicElements, filterPhrase]) => this.filterPeriodicElements(periodicElements, filterPhrase))
    );
  }

  public get isLoading$(): Observable<boolean> {
    return this.state.select('isLoading');
  }

  public set filterPhrase(value: string) {
    this.state.set({ filterPhrase: value });
  }

  public fetchPeriodicElements(): void {
    this.actions.fetchPeriodicElements();
  }

  public editPeriodicElements(position: number, periodcElement: PeriodicElement): void {
    this.actions.editPeriodicElements({ position, periodcElement });
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
