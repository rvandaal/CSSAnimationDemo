import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BackgroundLayerComponent } from './background-layer/background-layer.component';
import { LetterLayerComponent } from './letter-layer/letter-layer.component';
import { WordContainerComponent } from './word-container/word-container.component';

@NgModule({
  declarations: [
    AppComponent,
    BackgroundLayerComponent,
    LetterLayerComponent,
    WordContainerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
