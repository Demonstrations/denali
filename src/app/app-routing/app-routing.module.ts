import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes:Routes = [
  { path: '', redirectTo:'/video-chat', pathMatch:'full'},
  { path:'video-chat', loadChildren: 'app/modules/video-chat/video-chat.module#VideoChatModule'},
  { path:'daily', loadChildren: 'app/modules/daily/daily.module#DailyModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule],
  declarations: []
})
export class AppRoutingModule { }
