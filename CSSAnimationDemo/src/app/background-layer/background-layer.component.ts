import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-background-layer',
  templateUrl: './background-layer.component.html',
  styleUrls: ['./background-layer.component.scss']
})
export class BackgroundLayerComponent implements OnInit {

  @Input()
  aantalGedropt: number;

  constructor() { }

  ngOnInit() {
  }

}
