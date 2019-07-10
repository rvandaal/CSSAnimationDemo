import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  aantalGedropt = 0;

  topWord = 'TENNIS';
  bottomWord = 'GOLF';
  leftWord = 'KICKBOKSEN';
  rightWord = 'SPEERWERPEN';

  onGedropt(aantal: number) {
    this.aantalGedropt = aantal;
  }
}
