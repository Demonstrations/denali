import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  routes = [
    {name:"daily", path:"/daily"},
    {name:"video", path:"/video-chat"}
  ];
}
