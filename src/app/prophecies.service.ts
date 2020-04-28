import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PropheciesService {

  constructor(private httpClient: HttpClient) {

  }

  getProphecies(): Observable<Prophecy[]> {
    return this.getProphecyPage().pipe(
      map(data => {
        const parser = new DOMParser();
        return parser.parseFromString(data, 'text/html');
      }),
      map(document => {
        return this.parseProphecies(document);
      })
    );
  }

  parseProphecies(document: Document): Prophecy[] {
    const filterTable = document.getElementById('filtertable');
    const rows = filterTable.querySelectorAll('tr');
    const result: Prophecy[] = [];
    rows.forEach(row => {
      const cols = row.querySelectorAll('td');
      if (cols.length > 4) {
        result.push({
          name: cols[1].innerText,
          type: cols[2].innerText,
          targetItem: cols[3].innerText,
          sourceItem: cols[4].innerText,
        });
      }
    });
    return result;
  }

  getProphecyPage(): Observable<any> {
    return this.httpClient.get(
      '/prophecies', { responseType: 'text'}
    );
  }

}

export interface Prophecy {
  name: string;
  type: string;
  sourceItem: string;
  targetItem: string;
}
