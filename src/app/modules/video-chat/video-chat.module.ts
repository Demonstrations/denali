import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoChatComponent } from './video-chat.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:'', component:VideoChatComponent}
    ])
  ],
  declarations: [VideoChatComponent]
})
export class VideoChatModule { }
