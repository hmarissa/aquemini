// Sidebar and Credits Panel
function openNav() {
    document.getElementById("mySidenav").style.width = "25vw";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function openCredits() {
    document.getElementById("albumCredits").style.width = "25vw";
}

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
    initProgressBar();
}

function initProgressBar() {
    player1 = document.getElementById("player2");
    const playPauseBtn = document.querySelector(".play-pause");
    const playPauseImg = document.getElementById("playPauseImg");

    player1.addEventListener("play", function () {
        console.log("Playing from:", player1.currentTime);
        document.getElementById("seekObj1").style.display = "block";
    });

    player1.addEventListener("timeupdate", timeCal);

    playPauseBtn.addEventListener("click", function () {
        if (player1.paused && player1.readyState >= 2) {
            player1.play();
            playPauseImg.src = "img/pause.svg";
        } else {
            player1.pause();
            playPauseImg.src = "img/play.svg";
        }
    });

    player1.addEventListener("pause", function () {
        console.log("Paused at:", player1.currentTime);
    });

    player1.addEventListener("ended", function () {
        console.log("Track ended.");
        playPauseImg.src = "img/play.svg";
    });
}

function timeCal() {
    const width = jQuery("#timeline1").width();
    const length = player1.duration;
    const current_time = player1.currentTime;

    const playhead = document.getElementById("seekObj1");
    const progressFill = document.querySelector(".progress-fill");

    const progress = width * (current_time / length);
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
    const player = document.getElementById("player2");
    const wasPlaying = !player.paused;

    player.currentTime = player.duration * clickPercent(event, timeline, timelineWidth);

    if (wasPlaying && player.readyState >= 2) {
        player.play();
    }
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
    playerId = "player2";
    const player = document.getElementById(playerId);
    window.addEventListener('mousemove', dragFunc);
}

function dragFunc(e) {
    const newMargLeft = e.clientX - getPosition(timeline);

    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        playhead.style.marginLeft = newMargLeft + "px";
    } else if (newMargLeft < 0) {
        playhead.style.marginLeft = "0px";
    } else {
        playhead.style.marginLeft = timelineWidth + "px";
    }
}

function mouseUp(e) {
    if (onplayhead != null) {
        const player = document.getElementById(playerId);
        window.removeEventListener('mousemove', dragFunc);
        player.currentTime = player.duration * clickPercent(e, timeline, timelineWidth);
        player1.addEventListener("timeupdate", timeCal);
    }
    onplayhead = null;
}

// Removed unnecessary pause logic from timeUpdate
function timeUpdate() {
    const playPercent = timelineWidth * (player1.currentTime / player1.duration);
    playhead.style.marginLeft = playPercent + "px";
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
