import { map, tap, mapTo } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  loading$: Subject<void> = new Subject();

  loaded: boolean;

  itemsMap: Map<string, Item>;

  pricesMap: Map<number, any>;

  constructor(private httpClient: HttpClient) {
  }

  load() {
    forkJoin(this.loadItems(), this.loadCompactPrices()).pipe(
      mapTo(void 0),
      tap(() => this.loaded = true),
    ).subscribe(this.loading$);
  }

  loadCompactPrices() {
    return this.httpClient.get('/compact?league=Delirium').pipe(
      tap((data: any[]) => {
        this.pricesMap = data.reduce((map, item) => {
          map.set(item.id, item);
        }, new Map())
      })
    )
  }

  loadItems() {
    return this.httpClient.get('/items').pipe(
      tap((items: Item[]) => {
        this.itemsMap = items.reduce((map, item) => {
          map.set(item.name, item);
          return map;
        }, new Map());
      }))
  }

  getItemPrice(name: string): Observable<number> {
    return this.getItem(name).pipe(
      map(item => this.pricesMap.get(item.id)),
      map(prices => prices.median),
    );
  }

  getItem(name: string): Observable<Item> {
    if (this.loaded) {
      return of(this.itemsMap.get(name));
    }
    return this.loading$.pipe(
      map(() => this.itemsMap.get(name))
    );
  }
}

export interface Item {
  id: number,
  name: string,
}
