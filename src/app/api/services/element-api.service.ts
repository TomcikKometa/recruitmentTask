import { Injectable } from '@angular/core';
import { PeriodicElement } from '../models/periodicElement';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElementApiService {
  private elementData: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' }
  ];

  public getPeriodicElements(): Observable<PeriodicElement[]> {
    return of(this.elementData).pipe(delay(2000));
  }

  public editSinglePeriodicElement(position:number, elementToSave: PeriodicElement): Observable<void> {
    this.elementData = this.elementData.map((singleElement: PeriodicElement) => {
      if (position === singleElement.position) {
        return {
          ...elementToSave
        };
      }
      return singleElement;
    });
    return of(void 0).pipe(delay(1000))
  }
}
