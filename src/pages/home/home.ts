import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SMS } from '@ionic-native/sms';
import {Network} from "@ionic-native/network";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private network: Network,public navCtrl: NavController,private tts: TextToSpeech,private sms: SMS) {



  }

  ionViewDidLoad(){
    this.network.onDisconnect().subscribe(() => {
      document.getElementById('nettype').innerText = '网络已断开 :-(' ;
    });

    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          document.getElementById('nettype').innerText = '当前网络为WIFE' ;
        }else{
          document.getElementById('nettype').innerText = '当前网络为数据' ;
        }
      }, 1000);
    });
  }

  speak(words:any){
    alert(words.value);
    this.tts.speak(words.value)
      .then(() => alert('Success'))
      .catch((reason: any) => alert(reason));
  }


  sendmsg(phonenum:any,message:any){
    this.sms.send(phonenum.value, message.value);
  }






}
