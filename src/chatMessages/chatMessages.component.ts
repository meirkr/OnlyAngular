import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder, JsonHubProtocol } from '@aspnet/signalr';
import { ChatLoginService } from '../login/chatLogin.service';
import { stringify } from 'querystring';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'chatMessages',
  templateUrl: './chatMessages.component.html',
})
export class ChatMessagesComponent implements OnInit {

    private _hubConnection: HubConnection;
    nick = '';
    message = '';
    messages: string[] = [];
    private connected = false;

    constructor(private ChatLoginService:ChatLoginService) {

    }

    // ngOnInit(): void {
    //   this.ChatLoginService.GetLoginObservable().subscribe(this.onLoggedIn);
    // }

    // private onLoggedIn(nickName) {
    //   if (nickName.length > 0) {
    //     this.nick = nickName;
    //     this.reconnect();
    //   }
    // }
  
    ngOnInit(): void {
      this.ChatLoginService.GetLoginObservable().subscribe(
        nickName =>  {
          if (nickName.length > 0) {
            this.nick = nickName;
            this.reconnect();
          }
        });
  }

    private reconnect() : void {

      this._hubConnection = new HubConnectionBuilder()
        .withUrl('/robot')
        .build();

      this._hubConnection
        .onclose(() => {
          this.connected = false;
          console.log('Disconnected');

          this.reconnect();

        });

      this._hubConnection.on('sendToAll', (nick: string, receivedMessage: string) => {
        var senderTime = new Date();
        var messageToSend = senderTime.toLocaleString() + ":  " + this.message;
  
        const text = `(${senderTime.toLocaleString()}) [${nick}]: ${receivedMessage}`;
        console.log(`arrived from ${nick}, message: ${receivedMessage}`);
        this.messages.unshift(text);
      });

      this._hubConnection.on('SendObjAsync', (obj: object) => {

        var objAsString = new JsonPipe().transform(obj);
        var senderTime = new Date();
        var messageToSend = senderTime.toLocaleString() + ":  " + this.message;
  
        const text = `(${senderTime.toLocaleString()}) [received]: ${objAsString}`;
        console.log(`arrived from [received]: ${objAsString}`);
        this.messages.unshift(text);
      });

      this._hubConnection
      .start()
      .then(() => this.OnConnected())
      .catch(err => {
        this.connected = false;
        console.log('Error while establishing connection :(' + err);
        setTimeout(() => this.reconnect(), 5000);
      });

    }

    private OnConnected() {
      this.connected = true;
      console.log('Connection started!');
    }

    public sendMessage(): void {
      var messageToSend = this.message;
      this.message = '';
      this._hubConnection
        // .send('sendToAll', this.nick, messageToSend)
        .send('Send', messageToSend)
        .catch(err => console.error(err));
      }
    
    public startMoving(direction: string): void {
      this._hubConnection
        .send('StartMoving', direction)
        .catch(err => console.error(err));
      }
      
    public stopMoving(): void {
      this._hubConnection
        .send('StopMoving')
        .catch(err => console.error(err));
      }
}

