import { Component, OnInit } from '@angular/core';
import { delay } from 'q';

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

  ngOnInit() {
    
  }
}
