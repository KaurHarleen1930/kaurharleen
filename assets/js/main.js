// main.js - Updated version with error fixes while maintaining functionality
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    const elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    });
  };

  /**
   * Mobile nav toggle
   */
  const toggleMobileNav = function() {
    const header = select('header');
    if (header) {
      header.classList.toggle('mobile-active');
      if (this.classList) {
        this.classList.toggle('bi-list');
        this.classList.toggle('bi-x');
      }
    }
  };
  on('click', '.mobile-menu-toggle', toggleMobileNav);

  /**
   * Click outside mobile menu to close it
   */
  document.addEventListener('click', function(e) {
    const header = select('header');
    const mobileToggle = select('.mobile-menu-toggle');
    if (header && mobileToggle) {
      if (!header.contains(e.target) && !mobileToggle.contains(e.target)) {
        header.classList.remove('mobile-active');
        const mobileToggleIcon = select('.mobile-menu-toggle i');
        if (mobileToggleIcon && mobileToggleIcon.classList) {
          mobileToggleIcon.classList.replace('bi-x', 'bi-list');
        }
      }
    }
  });

  /**
   * Mobile menu link click handler
   */
  on('click', '.navmenu a', function(e) {
    const header = select('header');
    if (header && header.classList.contains('mobile-active')) {
      const mobileToggle = select('.mobile-menu-toggle');
      if (mobileToggle) {
        toggleMobileNav.call(mobileToggle);
      }
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  });

  /**
   * Skills animation
   */
  let skillsContent = select('.skills-content');
  if (skillsContent) {
    // Animate progress bars on scroll
    const progressBars = select('.progress .progress-bar', true);
    if (progressBars && progressBars.length > 0) {
      window.addEventListener('load', () => {
        progressBars.forEach((el) => {
          setTimeout(() => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          }, 400);
        });
      });
    }
  }

  /**
   * Scroll top button
   */
  let scrollTopButton = select('#scroll-top');
  if (scrollTopButton) {
    const toggleScrollTopButton = () => {
      if (window.scrollY > 100) {
        scrollTopButton.classList.add('active');
      } else {
        scrollTopButton.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleScrollTopButton);
    document.addEventListener('scroll', toggleScrollTopButton);
    scrollTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Initiate typed.js
   */
  const typedTextElement = select('.typed');
  if (typedTextElement && typeof Typed !== 'undefined') {
    try {
      let typed_strings = typedTextElement.getAttribute('data-typed-items');
      if (typed_strings) {
        typed_strings = typed_strings.split(',');
        new Typed('.typed', {
          strings: typed_strings,
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
        });
      }
    } catch (error) {
      console.log("Typed.js initialization error: ", error);
    }
  }

  /**
   * Project tabs functionality
   */
  const projectTabs = select('#projectTabs');
  if (projectTabs) {
    const tabButtons = projectTabs.querySelectorAll('.nav-link');
    tabButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Remove active class from all tabs and tab panes
        select('#projectTabs .nav-link', true).forEach(tab => {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        });
        
        select('.tab-pane', true).forEach(pane => {
          pane.classList.remove('show', 'active');
        });
        
        // Add active class to clicked tab and corresponding pane
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        const targetSelector = this.getAttribute('data-bs-target');
        const target = select(targetSelector);
        if (target) {
          target.classList.add('show', 'active');
        }
      });
    });
  }

  /**
   * Project filtering
   */
  const filterButtons = select('.filter-btn', true);
  const projectCards = select('.project-card', true);

  if (filterButtons && filterButtons.length > 0 && projectCards && projectCards.length > 0) {
    window.addEventListener('load', () => {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Remove active class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to current button
          button.classList.add('active');
          
          // Get filter value
          const filterValue = button.getAttribute('data-filter');
          
          if (filterValue) {
            // Filter projects
            projectCards.forEach(card => {
              if (filterValue === 'all') {
                card.style.display = 'block';
              } else {
                const categories = card.getAttribute('data-categories');
                if (categories && categories.includes(filterValue)) {
                  card.style.display = 'block';
                } else {
                  card.style.display = 'none';
                }
              }
            });
          }
        });
      });
    });
  }

  /**
   * Contact form validation and submission
   */
  const contactForm = select('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      const nameInput = select('#name');
      const emailInput = select('#email');
      const subjectInput = select('#subject');
      const messageInput = select('#message');
      
      const name = nameInput ? nameInput.value : '';
      const email = emailInput ? emailInput.value : '';
      const subject = subjectInput ? subjectInput.value : '';
      const message = messageInput ? messageInput.value : '';
      
      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
      }
      
      // Create mailto link for direct email functionality
      const mailtoLink = `mailto:kaurharleen@vt.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      window.location.href = mailtoLink;
      
      // Show success message
      const formStatus = select('#form-status');
      if (formStatus) {
        formStatus.innerHTML = '<div class="alert alert-success">Thank you for your message! I will get back to you soon.</div>';
      } else {
        alert('Thank you for your message! I will get back to you soon.');
      }
      
      contactForm.reset();
    });
  }

})();