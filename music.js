let index = Math.floor(Math.random() * 5) + 1;
let bgMusic = new Audio(`/assets/bg_music/${index}.mp3`);

function changeMusic() {
  bgMusic.src = `/assets/bg_music${index}.mp3`;
  if (index <= 5) {
    index += 1;
  } else {
    index = 1;
  }
}

window.addEventListener("load", () => {
  bgMusic.play();
});

bgMusic.addEventListener("ended", () => {
  changeMusic();
});
