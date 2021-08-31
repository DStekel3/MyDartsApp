import { Component, NgZone, OnInit } from '@angular/core';
import { delay } from 'q';

import { Speech } from '../assets/js/speech.js';
import { interval, Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { isNull } from 'util';

declare const annyang: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'MyDartsApp';
  P1:number = 501;
  P2:number = 501;
  defaultScore:number = null;
  message: string = "";
  SpeechObj: any;
  subscription: Subscription;
  Score_P1 : number = 0;
  subscriptionKey : string = environment.subscriptionKey;
  region : string = environment.region;

  voiceActiveSectionDisabled: boolean = true;
	voiceActiveSectionError: boolean = false;
	voiceActiveSectionSuccess: boolean = false;
	voiceActiveSectionListening: boolean = false;
	voiceText: any;

  constructor(private ngZone: NgZone){}
    initializeVoiceRecognitionCallback(): void {
      annyang.addCallback('error', (err) => {
        if(err.error === 'network'){
          this.voiceText = "Internet is require";
          annyang.abort();
          this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
        } else if (this.voiceText === undefined) {
          this.ngZone.run(() => this.voiceActiveSectionError = true);
          annyang.abort();
        }
      });

      annyang.addCallback('soundstart', (res) => {
        this.ngZone.run(() => this.voiceActiveSectionListening = true);
      });

      annyang.addCallback('end', () => {
        if (this.voiceText === undefined) {
          this.ngZone.run(() => this.voiceActiveSectionError = true);
          annyang.abort();
        }
      });

      annyang.addCallback('result', (userSaid) => {
        this.ngZone.run(() => this.voiceActiveSectionError = false);

        let queryText: any = userSaid[0];

        annyang.abort();

        this.voiceText = queryText;
        let text = this.voiceText;
        console.log('text:' + text + ', is nan: ' + isNaN(text))
        if (text == undefined) {
          this.Score_P1 = 0;
        }
        else if (!isNull(text) && !isNaN(text)) {
          this.Score_P1 = text;
          this.enterScore(this.Score_P1);
        }
        else if (text.indexOf("reset") !== -1) {
          this.resetScore();
        }

        this.ngZone.run(() => this.voiceActiveSectionListening = false);
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
      });
    }

    startVoiceRecognition(): void {
      this.voiceActiveSectionDisabled = false;
      this.voiceActiveSectionError = false;
      this.voiceActiveSectionSuccess = false;
      this.voiceText = undefined;

      if (annyang) {
        let commands = {
          'demo-annyang': () => { }
        };

        annyang.addCommands(commands);

        this.initializeVoiceRecognitionCallback();

        annyang.start({ autoRestart: false });
      }
    }

    closeVoiceRecognition(): void {
      this.voiceActiveSectionDisabled = true;
      this.voiceActiveSectionError = false;
      this.voiceActiveSectionSuccess = false;
      this.voiceActiveSectionListening = false;
      this.voiceText = undefined;

      if(annyang){
        annyang.abort();
      }
    }

  getRandomScore() {
    return Math.floor(Math.random() * 100)
  }

  gameFinished() {
    if (this.P1 == 0 || this.P2 == 0) {
      return true;
    }
    return false;
  }

  updateBotScore(playerScore: number){
    // update P2 score
    let opponent_score = this.getRandomScore();
    let validScore = this.checkIfScoreIsValid(this.P2, opponent_score);
    if (validScore) {
      playerScore -= opponent_score;
    }
    return playerScore;
  }
  

  async enterScore(score: number) {
    // update P1 score
    let validScore = this.checkIfScoreIsValid(this.P1, score);
    if (validScore){
      this.P1 -= score;
    }
    
    else {
      // make user know that input is invalid.
      this.message = "Whoops, bad turn."
      await delay(1000);
      this.message = ""
    }

    let gameFinished = this.gameFinished();
    if (gameFinished){
      // done
    }
    
    else{
      await delay(1000);
      this.P2 = this.updateBotScore(this.P2);
    }

    this.resetInput();
  }

  checkIfScoreIsValid(playerScore:number, score: number) {
    if (score >= 0 && score <= 180){
      let newScore = playerScore - score;
      if (newScore == 0 || newScore > 1){
        return true;
      }
    }

    return false;
  }

  resetInput() {
    this.defaultScore = null;
  }

  resetScore() {
    this.P1 = 501;
    this.P2 = 501;
  }

  listen() {
    this.SpeechObj = new Speech(this.subscriptionKey);
    this.SpeechObj.listen();

    //emit value in sequence every second
    const source = interval(1000);
    this.subscription = source.subscribe(val => this.pollScore());
  }

  pollScore() {
    let text = this.SpeechObj.getSpeech();
    console.log('text:' + text + ', is nan: ' + isNaN(text))
    if (text == undefined) {
      this.Score_P1 = 0;
    }
    else if (!isNull(text) && !isNaN(text)) {
      this.Score_P1 = text;
      this.enterScore(this.Score_P1);
    }
    else if (text.indexOf("reset") !== -1) {
      this.resetScore();
    }
  }

  stop() {
    this.subscription.unsubscribe();
    this.SpeechObj.stop();
  }

  ngOnInit() {
  }
}