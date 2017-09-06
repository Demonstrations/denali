import { Injectable } from '@angular/core';
import Socket from 'socket.io-client';
import {Message} from '../value-object/message';
import {Utils} from '../utils/utils';

@Injectable()
export class SocketService {
  //socket服务端地址
  host:string = "https://localhost:8088";
  //当前连接状态
  connected:boolean = false;
  //socket实例
  client = null;
  //回调函数池
  callbackList:Function[] = [];

  constructor() {
    this.client = Socket(this.host);
    this.client.on('ready', (data:any) => {
      this.connected = true;
    })
    .on('disconnect', () => {
      this.connected = false;
      this.client.connect(this.host);
    })
    .on('message', (msg:any) => {
      //接收服务端消息
      for(let key in this.callbackList){
        this.callbackList[key](msg);
      }
    });
  }
  //注册/取消注册 回调函数
  enrollCallback(callback:Function):string{
    let callbackId = Utils.getUUID();
    this.callbackList[callbackId] = callback;
    return callbackId;
  }
  unenrollCallback(callbackId:string){
    delete this.callbackList[callbackId];
  }
  //发送消息
  send(event:string, msg:Message){
    // console.log("send:", event, msg);
    if(!this.client)return;
    this.client.emit(event, msg);
  }
}
