// based off https://bug803414.bugzilla.mozilla.org/attachment.cgi?id=735088
var player = document.getElementById('player');
var overlay = document.getElementById('overlay');

navigator.mozGetUserMedia({ audio: true, video: true }, function (stream) {
  var recorder = new MediaRecorder(stream); // recorder.state === 'inactive
  var recording = true;

  // preview the video stream right away
  player.muted = "muted";
  player.src = URL.createObjectURL(stream);
  player.play();

  player.onclick = function (e) {
    console.log("CLICKED", recording)
    if (recording) {
      recorder.pause();
      recording = false;
      overlay.textContent = "Paused";
    } else {
      recorder.resume();
      recording = true;
      overlay.textContent = "";
    }

    e.preventDefault();
    return false;
  }

  // will be called again after stop, but state will be inactive
  recorder.ondataavailable = function (e) {
    if (recorder.state === 'recording') {
      console.log("Available", e.data, e.data.type);
      recorder.stop();
      stream.stop();

      player.onclick = null;
      player.muted = false;
      player.src = URL.createObjectURL(e.data);
      player.play();

      // recorder.onended = function () {
      //   URL.revokeObjectURL(recorder.src);
      //   recorder.src = null;
      // };
    }
  };

  recorder.start(9000); // record for 1s. recorder.state === 'recording'
}, function (err) {
  console.error('err: ' + err);
});

