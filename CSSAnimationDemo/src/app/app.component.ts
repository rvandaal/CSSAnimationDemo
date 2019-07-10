import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  topWord = 'SNELWANDELEN';
  bottomWord = 'GOLF';
  leftWord = 'KICKBOKSEN';
  rightWord = 'SPEERWERPEN';
}
