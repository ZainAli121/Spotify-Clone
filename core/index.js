async function getSongs() {
    let data = await fetch("http://127.0.0.1:5500/Naats/")
    let response = await data.text();
    console.log(response);
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


async function main() {
    // get list of all songs
    let songs = await getSongs()
    console.log(songs)

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> ${song} </li>`;
    }

    // play song 
    var audio = new Audio(songs[0]);
    // audio.play();
}

main()