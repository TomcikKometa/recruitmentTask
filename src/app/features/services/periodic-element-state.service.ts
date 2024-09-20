import { inject, Injectable } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { PeriodicElement } from '../../@api/models/periodicElement';
import { catchError, combineLatest, endWith, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { ElementApiService } from '../../@api/services/element-api.service';
import { rxActions } from '@rx-angular/state/actions';

@Injectable({
  providedIn: 'root'
})
export class PeriodicElementStateService {

  private readonly elementApiService:ElementApiService = inject(ElementApiService);

  private state = rxState<{
    periodicElements: PeriodicElement[];
    filterPhrase:string,
    isLoading: boolean;
    error: boolean;
  }>(({ set }) => {
    set({ periodicElements: [], isLoading: false,filterPhrase:'', error: false });
  
  });

  actions = rxActions<{ fetchPeriodicElements: {},editPeriodicElements:{ position: number, periodcElement: PeriodicElement} }>();


  constructor(){
    this.actions.fetchPeriodicElements$.pipe(tap(()=> this.state.set({isLoading:true})),switchMap(()=> this.elementApiService.getPeriodicElements()),tap((value)=> this.state.set({periodicElements:value}))
  }
  
  public get periodicElements$(): Observable<PeriodicElement[]> {
    return combineLatest([this.state.select('periodicElements'), this.state.select('filterPhrase')]).pipe(
      map(([periodicElements, filterPhrase]) => this.filterPeriodicElements(periodicElements, filterPhrase))
    );
  }

  public get isLoading$(): Observable<boolean> {
    return this.state.select('isLoading');
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
    this.isLoading.next(true);
    this._elementApiService
      .editSinglePeriodicElement(position, periodcElement)
      .pipe(
        first(),
        switchMap(() => this.getPeriodicElementsFromApi()),
        finalize(() => this.isLoading.next(false))
      )
      .subscribe();
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

  private getPeriodicElementsFromApi(): Observable<PeriodicElement[]> {
     this.elementApiService.getPeriodicElements().pipe(
      tap((periodicElements: PeriodicElement[]) => {
        this._periodicElements.next(periodicElements);
      })
    );
  }

 
}
