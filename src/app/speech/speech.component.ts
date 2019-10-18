import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as SpeechSDK from 'microsoft-speech-browser-sdk';
import { delay } from 'q';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.scss']
})

export class SpeechComponent {

  speechAuthToken: string;
  recognizer: any;
  audioContext: SpeechSDK.Context;

  constructor() {
    this.recognizer = this.RecognizerSetup(SpeechSDK, SpeechSDK.RecognitionMode.Conversation, 'en-US',
      SpeechSDK.SpeechResultFormat.Simple, environment.speechSubscriptionKey);
    this.RecognizerStart();

    //this.RecognizerStop();
  }

  trySpeech() {
    if (this.audioContext)
    this.RecognizerStart();
  }
  
  RecognizerSetup(SDK, recognitionMode, language, format, subscriptionKey) {
    this.audioContext = new SDK.Context(
      new SDK.OS(navigator.userAgent, 'Browser', null),
      new SDK.Device("Dell", "whatever", '1.0'));  

    const recognizerConfig = new SDK.RecognizerConfig(
      new SDK.SpeechConfig(this.audioContext),//Device('Speech', 'SpeechSample', '1.0.00000'))),
      recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation)
      language, // Supported languages are specific to each recognition mode Refer to docs.
      format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)

    // Alternatively use SDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
    const authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

    return SpeechSDK.CreateRecognizer(recognizerConfig, authentication);
  }

  RecognizerStart() {
    this.recognizer.Recognize((event) => {
        /*
            Alternative syntax for typescript devs.
            if (event instanceof SDK.RecognitionTriggeredEvent)
        */
        switch (event.Name) {
            case 'RecognitionTriggeredEvent' :
                console.log('Initializing');
                break;
            case 'ListeningStartedEvent' :
                console.log('Listening');
                break;
            case 'RecognitionStartedEvent' :
                console.log('Listening_Recognizing');
                break;
            case 'SpeechStartDetectedEvent' :
                console.log('Listening_DetectedSpeech_Recognizing');
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case 'SpeechHypothesisEvent' :
                // UpdateRecognizedHypothesis(event.Result.Text);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case 'SpeechFragmentEvent' :
                // UpdateRecognizedHypothesis(event.Result.Text);
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case 'SpeechEndDetectedEvent' :
                // OnSpeechEndDetected();
                console.log('Processing_Adding_Final_Touches');
                console.log(JSON.stringify(event.Result)); // check console for other information in result
                break;
            case 'SpeechSimplePhraseEvent' :
                // UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case 'SpeechDetailedPhraseEvent' :
                // UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                break;
            case 'RecognitionEndedEvent' :
                // OnComplete();
                console.log('Idle');
                console.log(JSON.stringify(event)); // Debug information
                break;
        }
    })
    .On(() => {
        // The request succeeded. Nothing to do here.
    },
    (error) => {
        console.error(error);
    });
  }

  RecognizerStop() {
    // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
    this.recognizer.AudioSource.TurnOff();
  }

}