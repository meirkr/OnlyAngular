import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // I added manually
import { ChatLoginComponent } from '../login/chatLogin.component';
import { ChatMessagesComponent } from '../chatMessages/chatMessages.component';
import { ChatLoginService } from '../login/chatLogin.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatLoginComponent,
    ChatMessagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule // I added manually

  ],
  providers: [ChatLoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
