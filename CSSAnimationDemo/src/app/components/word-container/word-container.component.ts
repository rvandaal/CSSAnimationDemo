import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-word-container',
  templateUrl: './word-container.component.html',
  styleUrls: ['./word-container.component.scss']
})
export class WordContainerComponent implements OnInit {

  @ViewChild('wordcontainer') wordcontainer: ElementRef;

  @Input()
  laatsteDropSide: string;

  @Input()
  side: string;

  constructor() { }

  ngOnInit() {

  }

}
