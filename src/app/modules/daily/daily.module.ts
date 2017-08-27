import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyComponent } from './daily.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path:'', component:DailyComponent }
    ])
  ],
  declarations: [DailyComponent]
})
export class DailyModule { }
