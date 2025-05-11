import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { EloService } from './elo.service';
import { CommonModule } from '@angular/common'; 

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgChartsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [EloService],
  bootstrap: [AppComponent]
})
export class AppModule {}
