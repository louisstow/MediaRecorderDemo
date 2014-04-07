// based off https://bug803414.bugzilla.mozilla.org/attachment.cgi?id=735088
var audio = document.getElementById('player');

navigator.mozGetUserMedia({ audio: true }, function (stream) {
  var recorder = new MediaRecorder(stream); // recorder.state === 'inactive

  // will be called again after stop, but state will be inactive
  recorder.ondataavailable = function (e) {
    if (recorder.state === 'recording') {
      console.log(e.data);
      recorder.stop();
      stream.stop();
      audio.src = URL.createObjectURL(e.data);
      audio.onended = function () {
        URL.revokeObjectURL(audio.src);
        audio.src = null;
      };
    }
  };

  recorder.start(1000); // record for 1s. recorder.state === 'recording'
}, function (err) {
  console.error('err: ' + err);
});

