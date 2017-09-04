import { Component, OnInit } from '@angular/core';
import {SocketService} from '../../service/socket.service';
import {Message} from '../../value-object/message';
import {Utils} from '../../utils/utils';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit {

  localStream:MediaStream = new MediaStream();
  remoteStream:MediaStream = new MediaStream();
  //ice server
  iceServer:RTCConfiguration = {
    iceServers: [{
      urls:["stun:stun1.l.google.com:19302"]
    }]
  }
  //回调函数Id
  callbackId:string = "";
  //最后发出的消息标识
  msgToken:string[] = [];
  //本地连接
  rtcPeerConnection:RTCPeerConnection;
  //
  tempCandidates:any[] = [];

  constructor(private socket:SocketService) { 
    this.callbackId = this.socket.enrollCallback(this.msgProcess.bind(this));
  }

  msgProcess(msg:any){
    // console.log(msg);
    if(!this.rtcPeerConnection)this.connect();
    let index:number = this.msgToken.indexOf(msg.token);
    if(index >= 0){
      delete this.msgToken[index];
      return;
    }
    let content = msg.content;
    switch(content.type){
      case 'description':
        this.rtcPeerConnection.setRemoteDescription(content.ref, () => {
          // console.log('add0', this.tempCandidates.length);
          while(this.tempCandidates.length > 0)
            this.rtcPeerConnection.addIceCandidate(this.tempCandidates.pop());
          
          if(this.rtcPeerConnection.remoteDescription.type == 'offer')
            this.rtcPeerConnection.createAnswer(this.setDescription.bind(this), err => {
              console.log('answer:', err);
            });
        });
        break;
      case 'candidate':
        if(!this.rtcPeerConnection.remoteDescription.type){
          this.tempCandidates.push(content.ref);
        }else{
          this.rtcPeerConnection.addIceCandidate(content.ref);
        }
          
        break;
    }
  }

  setDescription(desc:RTCSessionDescription){
    if(!this.rtcPeerConnection)this.connect();
    this.rtcPeerConnection.setLocalDescription(desc, () => {
      if(!this.socket)return;
      let msg:Message = new Message();
      msg.clientIds = ['all'];
      msg.content = {type:'description', ref:desc};
      this.socket.send('message', msg);
      this.msgToken.push(msg.token = Utils.getUUID());
    });
  }

  ngOnInit(){
    if(!navigator.mediaDevices.getUserMedia){
      console.log("浏览器不支持webRTC!");
      return;
    }
    navigator.mediaDevices.getUserMedia({
      video:true,
      audio:true
    }).then(localMediaStream => {
      //捕获视频
      this.localStream = localMediaStream;
    }, err => {
      console.log('rejected!', err);
    });
  }

  connect(){
    this.rtcPeerConnection = new RTCPeerConnection(this.iceServer);
    this.rtcPeerConnection.onicecandidate = evt => {
      if(!evt.candidate)return;
      // console.log('has1 ice candidate', evt.candidate);
      let msg:Message = new Message();
      msg.clientIds = ['all'];
      msg.content = {type:'candidate', ref:evt.candidate};
      this.socket.send('message', msg);
      this.msgToken.push(msg.token = Utils.getUUID());
    };
    this.rtcPeerConnection.onnegotiationneeded = () => {
      this.rtcPeerConnection.createOffer(this.setDescription.bind(this), (err) => {
        console.log('offer:', err);
      });
    }
    this.rtcPeerConnection.onaddstream = evt => {
      // console.log('add stream')
      this.remoteStream = evt.stream;
    }
    
    this.rtcPeerConnection.addStream(this.localStream);
  }

  ngOnDestroy(){
    if(this.rtcPeerConnection){
      this.rtcPeerConnection.close();
      this.rtcPeerConnection = null;
    }
    this.localStream = null;
    this.remoteStream = null;
    this.socket.unenrollCallback(this.callbackId);
  }
}
