/* 
   Bhushan E-Waste Recycling Pvt. Ltd.
   counters.js - Scroll-triggered numbers count up animation
*/

document.addEventListener('DOMContentLoaded', () => {
  const counterElements = document.querySelectorAll('.stat-counter');

  function animateCounter(element) {
    const targetValue = parseInt(element.getAttribute('data-target'), 10);
    const duration = parseInt(element.getAttribute('data-duration'), 10) || 2000; // default 2 seconds
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    
    let startTime = null;

    function count(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeOutQuad)
      const easedPercentage = percentage * (2 - percentage);
      const currentValue = Math.floor(easedPercentage * targetValue);
      
      // Format number with commas
      element.textContent = prefix + currentValue.toLocaleString('en-IN') + suffix;
      
      if (progress < duration) {
        requestAnimationFrame(count);
      } else {
        element.textContent = prefix + targetValue.toLocaleString('en-IN') + suffix;
      }
    }

    requestAnimationFrame(count);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target); // animate only once
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  });

  counterElements.forEach(element => {
    counterObserver.observe(element);
  });
});
