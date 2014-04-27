// based off https://bug803414.bugzilla.mozilla.org/attachment.cgi?id=735088
var player = document.getElementById('player');
var overlay = document.getElementById('overlay');
var timer;

navigator.mozGetUserMedia({ audio: true, video: true }, function (stream) {
  var recorder = new MediaRecorder(stream); // recorder.state === 'inactive
  var recording = true;

  // preview the video stream right away
  player.muted = "muted";
  player.src = URL.createObjectURL(stream);
  player.play();

  player.onclick = function (e) {
    console.log("\n\nCLICKED", recording, recorder.state)
    if (recording) {
      recorder.pause();
      recording = false;
      overlay.textContent = "Paused";
      timer.pause();
    } else {
      recorder.resume();
      recording = true;
      overlay.textContent = "";
      timer.resume();
    }

    e.preventDefault();
    return false;
  }

  // will be called again after stop, but state will be inactive
  recorder.ondataavailable = function (e) {
    console.log("\n\n---------DATA AVAILABLE", recorder.state)
    if (recorder.state === 'inactive') {
      console.log("Available", e.data, e.data.type);
      
      

      player.onclick = null;
      player.muted = false;
      player.src = URL.createObjectURL(e.data);
      player.play();

      //recorder.stop();

      //stream.stop();
    }
  };

  recorder.start();
  timer = new Timer(function () {
    console.log("\n\nSTOP RECORDING")
    recorder.stop();
  }, 7000);
}, function (err) {
  console.error('err: ' + err);
});

function Timer(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
}