var sdk = require("microsoft-cognitiveservices-speech-sdk");

function MySpeechApi() {
  // Pull in the required packages.
  // var fs = require("fs");
  var key = 'hi';
  this.subscriptionKey = key;
  this.serviceRegion = "westeurope";

  // We are done with the setup
  console.log("Now recognizing from: " + filename);

  // Create the audio-config pointing to our stream and
  // the speech config specifying the language.
  var audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
  var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

  // Setting the recognition language to English.
  speechConfig.speechRecognitionLanguage = "en-US";

  // Create the speech recognizer.
  this.recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  this.listen = function(){
    // Start the recognizer and wait for a result.
    this.recognizer.recognizeOnceAsync(
      function (result) {
        console.log(result);

        this.recognizer.close();
        this.recognizer = undefined;
      },
      function (err) {
        console.trace("err - " + err);

        this.recognizer.close();
        this.recognizer = undefined;
      });
  }
}

// // Replace with your own subscription key, service region (e.g., "westus"), and
// // the name of the file you want to run through the speech recognizer.
// var serviceRegion = "westeurope"; // e.g., "westus"
// var filename = "YourAudioFile.wav"; // 16000 Hz, Mono

// // Create the push stream we need for the speech sdk.
// var pushStream = sdk.AudioInputStream.createPushStream();

// // Open the file and push it to the push stream.
// fs.createReadStream(filename).on('data', function(arrayBuffer) {
//   pushStream.write(arrayBuffer.buffer);
// }).on('end', function() {
//   pushStream.close();
// });

// // We are done with the setup
// console.log("Now recognizing from: " + filename);

// // Create the audio-config pointing to our stream and
// // the speech config specifying the language.
// var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
// var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

// // Setting the recognition language to English.
// speechConfig.speechRecognitionLanguage = "en-US";

// // Create the speech recognizer.
// var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

// // Start the recognizer and wait for a result.
// recognizer.recognizeOnceAsync(
//   function (result) {
//     console.log(result);

//     recognizer.close();
//     recognizer = undefined;
//   },
//   function (err) {
//     console.trace("err - " + err);

//     recognizer.close();
//     recognizer = undefined;
//   });