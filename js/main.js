/* 
   Bhushan E-Waste Recycling Pvt. Ltd.
   main.js - Nav, scroll reveal, testimonial carousel, modal video
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header and Quick Pickup Sticky Banner
  const header = document.querySelector('.site-header');
  const stickyBanner = document.querySelector('.sticky-booking-banner');
  const scrollThreshold = 80;
  const bannerThreshold = 500;

  function updateStickyElements() {
    const whatsappBtn = document.querySelector('.sticky-whatsapp-btn');
    const whatsappWidget = document.getElementById('whatsappChatWidget');
    
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (stickyBanner) {
      if (window.scrollY > bannerThreshold) {
        stickyBanner.classList.add('active');
        whatsappBtn?.classList.add('raised');
        whatsappWidget?.classList.add('raised');
      } else {
        stickyBanner.classList.remove('active');
        whatsappBtn?.classList.remove('raised');
        whatsappWidget?.classList.remove('raised');
      }
    }
  }

  window.addEventListener('scroll', updateStickyElements);

  // Trigger scroll checks once on load
  updateStickyElements();

  // 2. Mobile Hamburguer Nav Menu
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');

  function openMobileNav() {
    mobileNavOverlay.classList.add('open');
    mobileNavDrawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Disable background scrolling
  }

  function closeMobileNav() {
    mobileNavOverlay.classList.remove('open');
    mobileNavDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
  }

  // Close drawer on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
      closeVideoModal();
    }
  });

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 4. Testimonial Carousel
  const track = document.querySelector('.testimonial-track');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const dotsContainer = document.querySelector('.testimonial-dots');

  if (track && slides.length > 0 && dotsContainer) {
    let currentIndex = 0;
    const slideCount = slides.length;
    const dots = [];

    // Create Navigation Dots
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('testimonial-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }

    function goToSlide(index) {
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;
      
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    }

    // Auto play every 6 seconds
    let autoplayInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);

    // Stop autoplay when user interacts
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(autoplayInterval);
      });
    });
  }

  // 5. Watch Our Process - Video Modal Player
  const watchProcessBtns = document.querySelectorAll('.btn-watch-process, .watch-process-trigger');
  
  // Create video modal element on the fly
  const videoModalHTML = `
    <div class="video-modal-overlay" id="videoModal" style="position: fixed; inset: 0; background: rgba(11, 31, 58, 0.9); z-index: 2000; opacity: 0; visibility: hidden; display: flex; align-items: center; justify-content: center; transition: all var(--transition-normal); padding: var(--spacing-lg);">
      <div class="video-modal-container" style="position: relative; width: 100%; max-width: 800px; aspect-ratio: 16/9; background: #000; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-xl); transform: scale(0.9); transition: transform var(--transition-normal);">
        <button class="video-modal-close" style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; font-size: 20px; font-weight: bold; z-index: 10;" aria-label="Close video">&times;</button>
        <iframe width="100%" height="100%" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border: 0; width: 100%; height: 100%;"></iframe>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', videoModalHTML);

  const videoModal = document.getElementById('videoModal');
  const videoContainer = videoModal.querySelector('.video-modal-container');
  const videoIframe = videoModal.querySelector('iframe');
  const videoCloseBtn = videoModal.querySelector('.video-modal-close');

  function openVideoModal(url = 'https://www.youtube.com/embed/dQw4w9WgXcQ') {
    videoIframe.src = url;
    videoModal.style.opacity = '1';
    videoModal.style.visibility = 'visible';
    videoContainer.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    videoModal.style.opacity = '0';
    videoModal.style.visibility = 'hidden';
    videoContainer.style.transform = 'scale(0.9)';
    document.body.style.overflow = '';
    setTimeout(() => {
      videoIframe.src = ''; // reset iframe to stop audio
    }, 300);
  }

  watchProcessBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Open with a placeholder video URL (representing their recycling tour)
      openVideoModal('https://www.youtube.com/embed/fD27o3y9c0g');
    });
  });

  videoCloseBtn.addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  // 6. Accordion Functionality (for FAQ)
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const content = trigger.nextElementSibling;
      const isActive = parent.classList.contains('active');
      
      // Close all accordions in the same group
      const siblingItems = parent.parentElement.querySelectorAll('.accordion-item');
      siblingItems.forEach(item => {
        item.classList.remove('active');
        const siblingContent = item.querySelector('.accordion-content');
        if (siblingContent) siblingContent.style.maxHeight = null;
      });

      if (!isActive) {
        parent.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        parent.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });

  // 7. WhatsApp Chat Bot Widget Injection and Logic
  const whatsappBtn = document.querySelector('.sticky-whatsapp-btn');
  if (whatsappBtn) {
    function getCurrentTime() {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return `${hours}:${minutes} ${ampm}`;
    }

    const originalWaUrl = whatsappBtn.getAttribute('href');
    
    // Inject Chatbot Widget HTML dynamically
    const chatWidgetHTML = `
      <div class="whatsapp-chat-widget" id="whatsappChatWidget">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="chat-avatar-icon">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span class="online-indicator"></span>
            </div>
            <div>
              <h4 class="chat-bot-name">Bhushan E-Waste Assistant</h4>
              <span class="chat-bot-status">Online (Replies instantly)</span>
            </div>
          </div>
          <button class="chat-close-btn" id="chatCloseBtn" aria-label="Close Chat">&times;</button>
        </div>
        <div class="chat-body" id="chatBody">
          <div class="chat-message bot-message">
            <div class="message-bubble">
              Hello! 👋 Welcome to Bhushan E-Waste Recycling. I'm your virtual assistant. How can I help you today?
            </div>
            <span class="message-time">${getCurrentTime()}</span>
          </div>
        </div>
        <div class="chat-quick-replies" id="chatQuickReplies">
          <button class="quick-reply-btn" data-question="q1">How to book a pickup?</button>
          <button class="quick-reply-btn" data-question="q2">What items do you recycle?</button>
          <button class="quick-reply-btn" data-question="q3">Is my data safe?</button>
          <button class="quick-reply-btn" data-question="q4">Do you provide compliance certificates?</button>
          <button class="quick-reply-btn" data-question="live">💬 Chat with live agent</button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatWidgetHTML);
    
    const widget = document.getElementById('whatsappChatWidget');
    const chatBody = document.getElementById('chatBody');
    const closeBtn = document.getElementById('chatCloseBtn');
    const quickRepliesContainer = document.getElementById('chatQuickReplies');

    // Predefined bot responses
    const botReplies = {
      q1: "Booking an authorized doorstep e-waste pickup is simple!<br><br>Click the <strong>'Book Pickup'</strong> button in the main menu or in the sticky banner at the bottom of the page. Fill out our form with your contact details, estimated weight, list of items, and submit. Our logistics team will call you back to schedule a collection date.",
      q2: "We are authorized to recycle all categories of electronic waste:<br>• <strong>IT & Telecom</strong>: Laptops, PCs, servers, networking devices, printers, cellphones.<br>• <strong>Large/Small Appliances</strong>: Air conditioners, TVs, refrigerators, microwave ovens.<br>• <strong>Batteries</strong>: Lithium-ion, lead-acid, UPS batteries, and industrial cables.",
      q3: "Yes, data security is our top priority! 🔒<br><br>We follow strict data sanitization procedures. Hard drives, SSDs, and storage devices are either degaussed or physically shredded at our Nashik recycling facility. We issue a formal, legally audit-ready <strong>Data Destruction Certificate</strong> for compliance.",
      q4: "Yes, we are a government-authorized recycler with full CPCB and MPCB licenses. 📜<br><br>We provide official <strong>Green Certificates (Form 2 / Form 6)</strong> and disposal manifests that serve as legal proof of environment-friendly recycling for corporate audits.",
      live: "Connecting you to our Live Support Executive... Opening WhatsApp chat now!"
    };

    function toggleChat(forceClose = false) {
      if (forceClose) {
        widget.classList.remove('open');
      } else {
        widget.classList.toggle('open');
        // Initial scroll to bottom when opening
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }

    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleChat();
    });

    closeBtn.addEventListener('click', () => {
      toggleChat(true);
    });

    // Close chat if clicked outside the widget
    document.addEventListener('click', (e) => {
      if (!widget.contains(e.target) && !whatsappBtn.contains(e.target) && widget.classList.contains('open')) {
        toggleChat(true);
      }
    });

    // Handle Quick Replies
    quickRepliesContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-reply-btn')) {
        const questionId = e.target.getAttribute('data-question');
        const questionText = e.target.textContent;

        // 1. Add User's Question Message
        const userMsgHTML = `
          <div class="chat-message user-message">
            <div class="message-bubble">${questionText}</div>
            <span class="message-time">${getCurrentTime()}</span>
          </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', userMsgHTML);
        chatBody.scrollTop = chatBody.scrollHeight;

        // 2. Add Typing Indicator Bubble
        const typingId = 'typing_' + Date.now();
        const typingHTML = `
          <div class="chat-message bot-message" id="${typingId}">
            <div class="message-bubble typing-indicator">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', typingHTML);
        chatBody.scrollTop = chatBody.scrollHeight;

        // 3. Simulate Bot Reply
        setTimeout(() => {
          // Remove typing indicator
          const typingElement = document.getElementById(typingId);
          if (typingElement) typingElement.remove();

          // Append Reply
          const replyText = botReplies[questionId] || "I didn't quite catch that. How can I help you?";
          const botMsgHTML = `
            <div class="chat-message bot-message">
              <div class="message-bubble">${replyText}</div>
              <span class="message-time">${getCurrentTime()}</span>
            </div>
          `;
          chatBody.insertAdjacentHTML('beforeend', botMsgHTML);
          chatBody.scrollTop = chatBody.scrollHeight;

          // If Live Chat clicked, open the wa.me link
          if (questionId === 'live') {
            setTimeout(() => {
              window.open(originalWaUrl, '_blank', 'noopener');
            }, 1200);
          }
        }, 1200);
      }
    });
  }
});
