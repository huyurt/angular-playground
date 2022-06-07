import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AngularDraggableModule } from 'angular2-draggable-zi';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgRulerComponent } from './components/ng-ruler/ng-ruler.component';

@NgModule({
  declarations: [
    AppComponent,
    NgRulerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AngularDraggableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
