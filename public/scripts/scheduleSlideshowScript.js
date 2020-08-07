var interval, currentPicture, pictureNumber;
var pictures, descriptions;
var slideshowInProgress;

function startSlideshow() {
  if (!slideshowInProgress) {
    slideshowInProgress = true;
    interval = setInterval(slideshow, 2000);
  }
}

function slideshow() {
  currentPicture = (currentPicture + 1) % pictureNumber;
  var slideshowImage = document.getElementById("slideshow");
  slideshowImage.src = pictures[currentPicture];
  slideshowImage.alt = descriptions[currentPicture];
}

function stopSlideshow() {
  if (slideshowInProgress) {
    interval = window.clearInterval(interval);
    slideshowInProgress = false;
  }
}

function setup() {
  currentPicture = 0;
  pictureNumber = 3;
  slideshowInProgress = false;
  pictures = ["gopher_mascot.jpeg", "school_logo.jpeg", "gopher_head.jpeg"];
  descriptions = ["gopher mascot", "school logo", "gopher head"];
}

window.addEventListener("load", setup);
