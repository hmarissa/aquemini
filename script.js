/* Set the width of the side navigation to 250px */

function openNav() {
    document.getElementById("mySidenav").style.width = "450px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function openCredits() {
    document.getElementById("albumCredits").style.width = "450px";
}

/* Set the width of the side navigation to 0 */
function closeCredits() {
    document.getElementById("albumCredits").style.width = "0";
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('mySidenav');
    const credits = document.getElementById('albumCredits');
    const tracklistTrigger = document.querySelector('.topnav span:nth-child(1)');
    const creditsTrigger = document.querySelector('.topnav span:nth-child(2)');

    if (sidebar.style.width !== '0px' &&
        !sidebar.contains(event.target) &&
        !tracklistTrigger.contains(event.target)) {
        closeNav();
    }

    if (credits.style.width !== '0px' &&
        !credits.contains(event.target) &&
        !creditsTrigger.contains(event.target)) {
        closeCredits();
    }
});


var player1, onplayhead, playerId, timeline, playhead, timelineWidth;

jQuery(window).on("load", function () {
    audioPlay();
    ballSeek();
});

function audioPlay() {
    var player = document.getElementById("player2");
    player.play(); // Start playing automatically on page load
    initProgressBar();
}

function initProgressBar() {
    player1 = document.getElementById("player2");
    var playPauseBtn = document.querySelector(".play-pause"); 
    var playPauseImg = document.getElementById("playPauseImg");
   
    player1.addEventListener("play", function () {
        console.log("Playing from:", player1.currentTime);
        document.getElementById("seekObj1").style.display = "block"; // Show the playhead
    });
    player1.addEventListener("timeupdate", timeCal);

    // Play/Pause button functionality
    playPauseBtn.addEventListener("click", function () {
        if (player1.paused) { 
            player1.play(); // Resume playback if paused
            playPauseImg.src = "img/pause.svg"; // Switch to pause image
        } else {
            player1.pause(); // Pause playback without resetting position
            playPauseImg.src = "img/play.svg"; // Switch to play image
        }
    });

    // Prevent the track from restarting when paused
    player1.addEventListener("pause", function () {
        console.log("Paused at:", player1.currentTime);
    });

    player1.addEventListener("play", function () {
        console.log("Playing from:", player1.currentTime);
    });

    player1.addEventListener("ended", function () {
        console.log("Track ended.");
        playPauseImg.src = "img/play.svg"; // Reset to play icon when song ends
    });
}

function timeCal() {
    var width = jQuery("#timeline1").width();
    var length = player1.duration;
    var current_time = player1.currentTime;

    var playhead = document.getElementById("seekObj1");
    var progressFill = document.querySelector(".progress-fill");

    var progress = width * (current_time / length);
    playhead.style.marginLeft = progress + "px";
    progressFill.style.width = progress + "px";
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

function clickPercent(event, timeline, timelineWidth) {
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
    var playPercent = timelineWidth * (player1.currentTime / player1.duration);
    playhead.style.marginLeft = playPercent + "px";
    if (player1.currentTime === player1.duration) {
        player1.pause();
    }
}

document.querySelector(".lyrics").addEventListener("wheel", function(event) {
    event.preventDefault();
    this.scrollLeft += event.deltaY * 2;
});

const lyricsContainer = document.querySelector(".lyrics");
const background = document.querySelector(".scrolling-bg");

lyricsContainer.addEventListener("scroll", function () {
    background.style.transform = `translateX(${-lyricsContainer.scrollLeft}px)`;
});