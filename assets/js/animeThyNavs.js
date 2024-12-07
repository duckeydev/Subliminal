document.addEventListener("DOMContentLoaded", function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
  
    // Function to animate the navbar background color change
    function animateNavbarColor(targetColor) {
      anime({
        targets: navbar,
        backgroundColor: targetColor,
        easing: 'easeInOutQuad',
        duration: 500
      });
    }
  
    // Add event listeners to each nav link
    navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        // Prevent the default navigation behavior temporarily
        event.preventDefault();
  
        // Animate navbar color to a different color before navigating
        animateNavbarColor('#ff7f50'); // Example color change
  
        // After animation completes, navigate to the target page
        setTimeout(() => {
          window.location.href = link.href;
        }, 500); // The delay should match the animation duration
      });
    });
  
    // On page load, ensure navbar color is set to the original state
    window.addEventListener('load', () => {
      animateNavbarColor('#333');  // Original color
    });
  });
  