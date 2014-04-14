// based off https://bug803414.bugzilla.mozilla.org/attachment.cgi?id=735088
var player = document.getElementById('player');

navigator.mozGetUserMedia({ audio: true, video: true }, function (stream) {
  var recorder = new MediaRecorder(stream); // recorder.state === 'inactive

  // will be called again after stop, but state will be inactive
  recorder.ondataavailable = function (e) {
    if (recorder.state === 'recording') {
      console.log(e.data);
      recorder.stop();
      stream.stop();

      player.src = URL.createObjectURL(e.data);
      player.play();
      recorder.onended = function () {
        URL.revokeObjectURL(recorder.src);
        recorder.src = null;
      };
    }
  };

  recorder.start(7000); // record for 1s. recorder.state === 'recording'
}, function (err) {
  console.error('err: ' + err);
});

