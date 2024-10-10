// Frontend JS for activing some interaction effect

const track = document.getElementById('posts-track')



window.onmousedown = (e) => {
  // console.log(e.clientX)
  track.dataset.mouseDownAt = e.clientX
}

window.onmouseup = () => {
  track.dataset.mouseDownAt = "0"
  track.dataset.prevPercentage = track.dataset.percentage
}


window.onmousemove = (e) => {
  if (track.dataset.mouseDownAt === "0") return
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX
  const maxDelta = window.innerWidth / 2

  const percent = (mouseDelta / maxDelta) * -100

  let nextPrecent = parseFloat(track.dataset.prevPercentage) + percent

  nextPrecent = Math.min(nextPrecent, 0)
  nextPrecent = Math.max(nextPrecent, -100)

  track.dataset.percentage = nextPrecent

  // track.style.transform = `translate(${nextPrecent}%, -50%)`
  track.animate({
    transform: `translate(${nextPrecent}%, -50%)`
  }, { duration: 1200, fill: 'forwards' })

  for(const card of track.getElementsByClassName('card')) {
    
    // card.style.backgroundPosition = `${nextPrecent + 100}% 50%`
    card.animate({
      backgroundPosition: `${nextPrecent + 100}% 50%`
    }, { duration: 1200, fill: 'forwards'})
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Get the <h1> element
  const heading = document.getElementById('heading-title');

  // Get the current page URL
  const currentPath = window.location.pathname;

  // Define the path where the <h1> should be hidden (example: /hide-header)
  if (currentPath === '/') {
    // Hide the <h1> if the current path matches    
    heading.style.visibility = 'visible';  // Or use display: none
    // enable onmousedown and onmouseup and onmousemove events
    track.style.pointerEvents = 'auto';
  } else {
    // Make sure the <h1> is visible on other pages
    heading.style.visibility = 'hidden';

    // disable onmousedown and onmouseup and onmousemove events of every thing not only track, track is not found in other page
    document.body.style.pointerEvents = 'none';
  }
});