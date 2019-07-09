import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BackgroundLayerComponent } from './background-layer/background-layer.component';
import { LetterLayerComponent } from './letter-layer/letter-layer.component';

@NgModule({
  declarations: [
    AppComponent,
    BackgroundLayerComponent,
    LetterLayerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
