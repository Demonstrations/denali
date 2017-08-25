import { Component } from '@angular/core';

const HEROES:Hero[] = [{id:2, name:'xxxx'}, {id:3, name:'yyyy'}];
export class Hero{
  id:number;
  name:string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  hero:Hero = {
    id: 1,
    name: 'wo shi shui'
  };
  heroes = HEROES;
}
