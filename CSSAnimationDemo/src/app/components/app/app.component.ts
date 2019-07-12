import { Component } from '@angular/core';
import { until } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  aantalTePlaatsenLetters = 0;

  topWord: string;
  bottomWord: string;
  leftWord: string;
  rightWord: string;

  constructor() {
    const allWords = [
      'BMX',
      'Golf',
      'Judo',
      'Darts',
      'Rugby',
      'Skiën',
      'Boksen',
      'Dammen',
      'Hockey',
      'Karate',
      'Roeien',
      'Squash',
      'Tennis',
      'Turnen',
      'Zeilen',
      'Biljart',
      'Bobslee',
      'Bowling',
      'Handbal',
      'Klimmen',
      'Rodelen',
      'Schaken',
      'Snooker',
      'Softbal',
      'Voetbal',
      'Zwemmen',
      'Atletiek',
      'Petanque',
      'Schermen',
      'Autosport',
      'Badminton',
      'Basketbal',
      'IJshockey',
      'Schaatsen',
      'Taekwondo',
      'Triathlon',
      'Volleybal',
      'Waterpolo',
      'Worstelen',
      'Gymnastiek',
      'Kitesurfen',
      'Langlaufen',
      'Motorsport',
      'Shorttrack',
      'Wielrennen',
      'Windsurfen',
      'Paardrijden',
      'Skispringen',
      'Tafeltennis'
    ];
    const numberOfWords = allWords.length;
    const index = [];
    for (let i = 0; i < 4; i++) {
      let randomIndex = -1;
      while (randomIndex === -1 || index.indexOf(randomIndex) > -1) {
        randomIndex = Math.round(Math.random() * numberOfWords);
      }
      index.push(randomIndex);
    }
    this.topWord = allWords[index[0]].toUpperCase();
    this.bottomWord = allWords[index[1]].toUpperCase();
    this.leftWord = allWords[index[2]].toUpperCase();
    this.rightWord = allWords[index[3]].toUpperCase();
  }



  onGedropt(aantal: number) {
    this.aantalTePlaatsenLetters = aantal;
  }
}
