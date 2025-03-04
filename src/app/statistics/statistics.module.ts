import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppComponent } from '../app.component';



@NgModule({
  declarations: [
    BarChartComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  bootstrap: [AppComponent],
})
export class StatisticsModule { }
