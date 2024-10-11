// Frontend JS for activing some interaction effect

const track = document.getElementById('posts-track')

document.addEventListener('DOMContentLoaded', () => {
  // Get the <h1> element
  const heading = document.getElementById('heading-title')

  const pageDetail = document.getElementById('detail-page')

  const form = document.querySelector('.editForm')

  const newPost = document.querySelector('.newPost')

  setTimeout(() => {
    newPost.classList.add('animate-in');
  }, 100)

  setTimeout(() => {
    form.classList.add('animate-in');
  }, 100)

  // Get the current page URL
  const currentPath = window.location.pathname;

  // Define the path where the <h1> should be hidden (example: /hide-header)
  if (currentPath === '/') {
    // Hide the <h1> if the current path matches    
    heading.style.visibility = 'visible';  // Or use display: none
    // enable onmousedown and onmouseup and onmousemove events
    // track.style.pointerEvents = 'auto';
  } else {
    // Make sure the <h1> is visible on other pages
    heading.style.visibility = 'hidden';

    // disable onmousedown and onmouseup and onmousemove events of every thing not only track, track is not found in other page
    // document.body.style.pointerEvents = 'none';
  }

  setTimeout(() => {
    pageDetail.classList.add('animate-in');
  }, 100);  // Small delay to ensure smooth transition

 
  // Handle the exit animation when the user clicks a link
  const navigateLink = document.getElementById('back-button');
  navigateLink.addEventListener('click', function (event) {
    event.preventDefault();  // Prevent immediate navigation
    pageDetail.classList.remove('animate-in');
    pageDetail.classList.add('animate-out');  // Add exit animation

    // After the animation ends, navigate to the new page
    setTimeout(() => {
      window.location.href = '/';  // Navigate to the home page ("/")
    }, 1000);  // Wait for the animation to finish (matches the transition duration)
  });

})

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

