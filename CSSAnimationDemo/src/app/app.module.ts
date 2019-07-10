import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app.component';
import { BackgroundLayerComponent } from './components/background-layer/background-layer.component';
import { LetterLayerComponent } from './components/letter-layer/letter-layer.component';
import { WordContainerComponent } from './components/word-container/word-container.component';

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
