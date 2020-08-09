// File that contains functions for slideshow on Schedule Page

var interval, currentPicture, pictureNumber;
var pictures, descriptions;
var slideshowInProgress;

// Start slideshow and create interval
function startSlideshow() {
  if (!slideshowInProgress) {
    slideshowInProgress = true;
    interval = setInterval(slideshow, 2000);
  }
}

// Determine picture to show and show it
function slideshow() {
  currentPicture = (currentPicture + 1) % pictureNumber;
  var slideshowImage = document.getElementById("slideshow");
  slideshowImage.src = pictures[currentPicture];
  slideshowImage.alt = descriptions[currentPicture];
}

// Stop slideshow and clear interval
function stopSlideshow() {
  if (slideshowInProgress) {
    interval = window.clearInterval(interval);
    slideshowInProgress = false;
  }
}

// Set-up the pictures in slideshow
function setup() {
  // Set the initial picture index
  currentPicture = 0;
  // Set total number of pictures
  pictureNumber = 3;
  slideshowInProgress = false;
  pictures = ["gopher_mascot.jpeg", "school_logo.jpeg", "gopher_head.jpeg"];
  descriptions = ["gopher mascot", "school logo", "gopher head"];
}

window.addEventListener("load", setup);
