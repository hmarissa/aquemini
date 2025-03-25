console.log("Audio script loaded successfully!");
/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "450px";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  var player1,onplayhead,playerId,timeline,playhead,timelineWidth;
jQuery(window).on("load", function () {
    audioPlay();
    ballSeek();

});

function audioPlay() {
    /*var player = document.getElementById("player2");*/
  var player = $("#player2")[0];
  //alert(player);
    player.play();
    initProgressBar();
    isPlaying = true;
}

function initProgressBar() {
    player1 = document.getElementById("player2");
    var playPauseBtn = document.querySelector(".play-pause"); 
    var playPauseImg = document.getElementById("playPauseImg");

    player1.addEventListener("timeupdate", timeCal);

    playPauseBtn.addEventListener("click", function () {
        if (player1.paused) { 
            player1.play();
            playPauseImg.src = "img/pause.svg"; // Switch to pause image
        } else {
            player1.pause();
            playPauseImg.src = "img/play.svg"; // Switch to play image
        }
    });

    // Ensure that pausing does not reset the track
    player1.addEventListener("pause", function () {
        console.log("Paused at:", player1.currentTime);
    });

    player1.addEventListener("play", function () {
        console.log("Playing from:", player1.currentTime);
    });
}

function timeCal() {
    var width = jQuery("#timeline1").width();
    var length = player1.duration;
    var current_time = player1.currentTime;

    // calculate total length of value
    var totalLength = calculateTotalValue(length);
  //console.info(totalLength);
    jQuery(".end-time").html(totalLength);

    // calculate current value time
    var currentTime = calculateCurrentValue(current_time);
    jQuery(".start-time").html(currentTime);

    var progressbar = document.getElementById("seekObj1");
    progressbar.style.marginLeft = width * (player1.currentTime / player1.duration) + "px";

}

function calculateTotalValue(length) {
    var minutes = Math.floor(length / 60);
      var  seconds_int = length - minutes * 60;
  if(seconds_int < 10){
    //console.info("here");
    seconds_int = "0"+seconds_int;
    //console.info(seconds_int);
  }
      var seconds_str = seconds_int.toString();
       var  seconds = seconds_str.substr(0, 2);
        var time = minutes + ':' + seconds;
//console.info(seconds_int)
    return time;
}

function calculateCurrentValue(currentTime) {
    var current_hour = parseInt(currentTime / 3600) % 24,
        current_minute = parseInt(currentTime / 60) % 60,
        current_seconds_long = currentTime % 60,
        current_seconds = current_seconds_long.toFixed(),
        current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);
    return current_time;
}

function ballSeek() {
     onplayhead = null;
     playerId = null;
     timeline = document.getElementById("timeline1");
     playhead = document.getElementById("seekObj1");
     timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

    timeline.addEventListener("click", seek);
    playhead.addEventListener('mousedown', drag);
    window.addEventListener('mouseup', mouseUp);

}


function seek(event) {
    var player = document.getElementById("player2");
    player.currentTime = player.duration * clickPercent(event, timeline, timelineWidth);
}

function clickPercent(e, timeline, timelineWidth) {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
}

function getPosition(el) {
    return el.getBoundingClientRect().left;
}

function drag(e) {
    player1.removeEventListener("timeupdate", timeCal);
    onplayhead = jQuery(this).attr("id");
    playerId = jQuery(this).parents("li").find("audio").attr("id");
    var player = document.getElementById(playerId);
    window.addEventListener('mousemove', dragFunc);
    player.removeEventListener('timeupdate', timeUpdate);
}


function dragFunc(e) {
    var player = document.getElementById(onplayhead);
    var newMargLeft = e.clientX - getPosition(timeline);

    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
        playhead.style.marginLeft = timelineWidth + "px";
    }
}

function mouseUp(e) {
    if (onplayhead != null) {
        var player = document.getElementById(playerId);
        window.removeEventListener('mousemove', dragFunc);
        player.currentTime = player.duration * clickPercent(e, timeline, timelineWidth);
        player1.addEventListener("timeupdate", timeCal);
        player.addEventListener('timeupdate', timeUpdate);
    }
    onplayhead = null;
}

function timeUpdate() {
    var player2 = document.getElementById(onplayhead);
    var player = document.getElementById(playerId);
    var playPercent = timelineWidth * (player.currentTime / player.duration);
    player2.style.marginLeft = playPercent + "px";
    // If song is over
    if (player.currentTime == player.duration) {
        player.pause();
    }

}
