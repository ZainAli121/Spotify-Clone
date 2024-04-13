// current track to be played
let current_track = new Audio();

function convertSecondsToMinutesSeconds(seconds) {
    // Calculate total minutes and remaining seconds
    const totalMinutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
  
    // Format the minutes and seconds with leading zeros if necessary
    const formattedMinutes = totalMinutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  
    // Combine minutes and seconds in the desired format
    const formattedTime = `${formattedMinutes}:${formattedSeconds}`;
  
    return formattedTime;
  }

// get songs
async function getSongs() {
    let data = await fetch("http://127.0.0.1:5500/Naats/")
    let response = await data.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;

    let links = div.getElementsByTagName("a");
    // console.log(links)
    let songs = []
    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Naats/")[1]);
        }
    }
    return songs
}

// play Music
const playMusic = (track, pause=false)=>{
   current_track.src = "/Naats/"+track
   if (!pause) {
       current_track.play()
       play.src = "/images/pause.svg"
    }
    play.style.width = "12px";

    document.querySelector(".songInfo").innerHTML = track
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
}


async function main() {
    // get list of all songs
    let songs = await getSongs()
    playMusic(songs[0], true)

    // dom
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + 
        `<li> 
        <img src="/images/music.svg" alt="">
        <div class="info">
        <div>${song} </div>
        <div>Zain</div>
        </div>
        <div class="playNow">
        <span>Play Now</span>
        <img class="invert" src="play.svg" alt="">
        </div>
        </li>`;
    }

    // attach event listener to each song for playing it 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    // add eventlistener to play and pause track 
    play.addEventListener("click", ()=>{    
        if(current_track.paused){
            current_track.play()
            play.src = "/images/pause.svg"
            // play.style.width = "11px";
        }
        else{
            current_track.pause()
            play.src = "play.svg"
        }
    })

    // event listener for tracking music's time 
    current_track.addEventListener("timeupdate", ()=>{
        document.querySelector(".songTime").innerHTML = `${convertSecondsToMinutesSeconds(current_track.currentTime)} / ${convertSecondsToMinutesSeconds(current_track.duration)}`
        document.querySelector(".circle").style.left = (current_track.currentTime / current_track.duration) * 100 +"%"
    })

    // add event listener to move seekbar 
    document.querySelector(".seekBar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        current_track.currentTime = ((current_track.duration) * percent) /100;
    })
}

main()