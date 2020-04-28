import { map } from 'rxjs/operators';
import { PropheciesService, Prophecy } from './prophecies.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fated';

  prophecies: Prophecy[] = [];

  constructor(private propheciesService: PropheciesService) {

  }

  ngOnInit() {
    this.propheciesService.getProphecies().pipe(
      map(data => data.filter(item => item.type === 'Fated'))
    ).subscribe((data) => {
      this.prophecies = data;
    });
  }

  trackBy(index, item) {
    return index;
  }
}
