export class Speech {
  constructor() {
    this.SpeechSDK = require('microsoft-cognitiveservices-speech-sdk/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle');
    this.Text = "";
  }
  
  getSpeech() {
    var text = this.Text;
    this.Text = "";
    return text.Text;
  }

  listen(){
  var phraseDiv, statusDiv;
  var key, authorizationToken, appId, phrases;
  var regionOptions;
  var languageOptions, formatOptions, inputSource, filePicker;
  var reco;
  var audioFile, audioFileValid;

  var subscriptionKey = '291c5f63570a452892cf30e470d544f1';
  var region = 'westeurope';

  var soundContext = undefined;
  try {
      var AudioContext = window.AudioContext // our preferred impl
          || window.webkitAudioContext       // fallback, mostly when on Safari
          || false;                          // could not find.

      if (AudioContext) {
          soundContext = new AudioContext();
      } else {
          alert("Audio context not supported");
      }
  }
  catch (e) {
      window.console.log("no sound context found, no audio output. " + e);
  }
  
  var lastRecognized = "";

  // If an audio file was specified, use it. Else use the microphone.
  // Depending on browser security settings, the user may be prompted to allow microphone use. Using continuous recognition allows multiple
  // phrases to be recognized from a single use authorization.
  var audioConfig = audioFileValid ? SpeechSDK.AudioConfig.fromWavFileInput(audioFile) : SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  
  var speechConfig;
  if (authorizationToken) {
      speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, region);
  } else {
      speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, region);
  }

  speechConfig.speechRecognitionLanguage = 'en-US';
  reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  // Before beginning speech recognition, setup the callbacks to be invoked when an event occurs.

  // The event recognizing signals that an intermediate recognition result is received.
  // You will receive one or more recognizing events as a speech phrase is recognized, with each containing
  // more recognized speech. The event will contain the text for the recognition since the last phrase was recognized.
  reco.recognizing = function (s, e) {
      window.console.log(e);
  };

  // The event recognized signals that a final recognition result is received.
  // This is the final event that a phrase has been recognized.
  // For continuous recognition, you will get one recognized event for each phrase recognized.
  reco.recognized = function (s, e) {
      window.console.log('text:' + e);
      this.Text = e;
  };

  // The event signals that the service has stopped processing speech.
  // https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognitioncanceledeventargs?view=azure-node-latest
  // This can happen for two broad classes of reasons.
  // 1. An error is encountered.
  //    In this case the .errorDetails property will contain a textual representation of the error.
  // 2. No additional audio is available.
  //    Caused by the input stream being closed or reaching the end of an audio file.
  reco.canceled = function (s, e) {
      window.console.log(e);
  };

  // Signals that a new session has started with the speech service
  reco.sessionStarted = function (s, e) {
      window.console.log(e);
  };

  // Signals the end of a session with the speech service.
  reco.sessionStopped = function (s, e) {
      window.console.log(e);
  };

  // Signals that the speech service has started to detect speech.
  reco.speechStartDetected = function (s, e) {
      window.console.log(e);
  };

  // Signals that the speech service has detected that speech has stopped.
  reco.speechEndDetected = function (s, e) {
      window.console.log(e);
  };

  // Starts recognition
  reco.startContinuousRecognitionAsync();
  }
}