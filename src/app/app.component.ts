import { Component } from '@angular/core';
import { HubConnection } from '@aspnet/signalr-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  private _hubConnection: HubConnection;
  nick = '';
  message = 'dummy';
  messages: string[] = [];
  private connected = false;

  ngOnInit() {
    console.log('ngOnInit!')
    this.nick = window.prompt('Your name:', 'John');

      this.reconnect();

    }

    private reconnect() {

      this._hubConnection = new HubConnection('/chat');
      //    this._hubConnection = new HubConnection('http://localhost:5000/chat');


      this._hubConnection
        .onclose(() => {
          this.connected = false;
          console.log('Disconnected');

          this.reconnect();

        });

      this._hubConnection.on('sendToAll', (nick: string, receivedMessage: string) => {
        const text = `${nick}: ${receivedMessage}`;
        console.log(`arrived from ${nick}, message: ${receivedMessage}`);
        this.messages.push(text);
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
      this._hubConnection
        .invoke('sendToAll', this.nick, this.message)
        .catch(err => console.error(err));
      }
}

