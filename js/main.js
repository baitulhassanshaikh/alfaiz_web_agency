/**
 * ALFAIZ Web Agency - Production JavaScript (Revised)
 * Pure Vanilla JavaScript (No frameworks, no build step, no dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Navigation Bar (Scroll state & Mobile Drawer)
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Compact navbar on scroll
  const handleNavScroll = () => {
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    const isActive = hamburger.classList.toggle('is-active');
    navMenu.classList.toggle('is-active');
    hamburger.setAttribute('aria-expanded', String(isActive));
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    hamburger.classList.remove('is-active');
    navMenu.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 868) {
          closeMobileMenu();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('is-active') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
        closeMobileMenu();
      }
    });
  }

  /* ==========================================================================
     2. Active Link Highlighter on Scroll (ScrollSpy)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const highlightActiveNav = () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  /* ==========================================================================
     3. Hero Right-Side Prototype Image Slider
     [REVISION]: Auto-playing 3-slide prototype screenshot carousel (5s interval),
     prev/next buttons, dot indicators, touch swipe support, and pause on hover.
     ========================================================================== */
  const heroTrack = document.getElementById('heroSliderTrack');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroPrevBtn = document.getElementById('heroSliderPrev');
  const heroNextBtn = document.getElementById('heroSliderNext');
  const heroDotsContainer = document.getElementById('heroSliderDots');
  const heroSliderCard = document.querySelector('.hero-slider-card');

  if (heroTrack && heroSlides.length) {
    let heroCurrentIndex = 0;
    const heroTotalSlides = heroSlides.length;
    let heroAutoplayTimer = null;

    // Generate indicator dots
    if (heroDotsContainer) {
      heroDotsContainer.innerHTML = '';
      heroSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('hero-slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to prototype slide ${i + 1}`);
        dot.addEventListener('click', () => heroGoToSlide(i));
        heroDotsContainer.appendChild(dot);
      });
    }

    const heroDots = heroDotsContainer ? heroDotsContainer.querySelectorAll('.hero-slider-dot') : [];

    const updateHeroSlider = () => {
      heroTrack.style.transform = `translateX(-${heroCurrentIndex * 100}%)`;
      heroDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === heroCurrentIndex);
      });
    };

    const heroNextSlide = () => {
      heroCurrentIndex = (heroCurrentIndex + 1) % heroTotalSlides;
      updateHeroSlider();
    };

    const heroPrevSlide = () => {
      heroCurrentIndex = (heroCurrentIndex - 1 + heroTotalSlides) % heroTotalSlides;
      updateHeroSlider();
    };

    const heroGoToSlide = (index) => {
      heroCurrentIndex = index;
      updateHeroSlider();
      restartHeroAutoplay();
    };

    if (heroNextBtn) {
      heroNextBtn.addEventListener('click', () => {
        heroNextSlide();
        restartHeroAutoplay();
      });
    }

    if (heroPrevBtn) {
      heroPrevBtn.addEventListener('click', () => {
        heroPrevSlide();
        restartHeroAutoplay();
      });
    }

    const startHeroAutoplay = () => {
      stopHeroAutoplay();
      heroAutoplayTimer = setInterval(heroNextSlide, 5000); // 5-second interval
    };

    const stopHeroAutoplay = () => {
      if (heroAutoplayTimer) {
        clearInterval(heroAutoplayTimer);
        heroAutoplayTimer = null;
      }
    };

    const restartHeroAutoplay = () => {
      stopHeroAutoplay();
      startHeroAutoplay();
    };

    if (heroSliderCard) {
      // Pause on hover
      heroSliderCard.addEventListener('mouseenter', stopHeroAutoplay);
      heroSliderCard.addEventListener('mouseleave', startHeroAutoplay);

      // Mobile Touch / Swipe Gesture
      let touchStartX = 0;
      let touchEndX = 0;

      heroSliderCard.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopHeroAutoplay();
      }, { passive: true });

      heroSliderCard.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const deltaX = touchEndX - touchStartX;
        if (Math.abs(deltaX) > 40) {
          if (deltaX < 0) {
            heroNextSlide();
          } else {
            heroPrevSlide();
          }
        }
        startHeroAutoplay();
      }, { passive: true });
    }

    startHeroAutoplay();
  }

  /* ==========================================================================
     4. Animated Stats Counter (IntersectionObserver)
     [REVISION]: Kept only "100% Responsive" and "Global Clients".
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-count');
  let statsTriggered = false;

  const animateCounters = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);

      if (prefersReducedMotion || isNaN(target)) {
        stat.textContent = target;
        return;
      }

      const duration = 1800;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        stat.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsTriggered) {
            statsTriggered = true;
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     [REVISION]: Portfolio Filter Bar and Lightbox event handlers removed.
     ========================================================================== */

  /* ==========================================================================
     5. Packages "Get Started" Auto-Fill Helper
     ========================================================================== */
  const packageButtons = document.querySelectorAll('.btn-select-package');
  const projectTypeSelect = document.getElementById('projectType');
  const messageTextarea = document.getElementById('formMessage');

  packageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const packageName = btn.getAttribute('data-package') || '';
      if (projectTypeSelect) {
        if (packageName.toLowerCase().includes('basic')) {
          projectTypeSelect.value = 'Landing Page';
        } else if (packageName.toLowerCase().includes('premium')) {
          projectTypeSelect.value = 'E-commerce';
        } else {
          projectTypeSelect.value = 'Business Website';
        }
      }
      if (messageTextarea && !messageTextarea.value.trim()) {
        messageTextarea.value = `Hello ALFAIZ Web Agency, I am interested in the ${packageName} Package for my business website.`;
      }
    });
  });

  /* ==========================================================================
     6. FAQ Accordion (Smooth toggle & accessible ARIA)
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('is-open');

      // Close other open FAQ items
      document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          const otherAnswer = openItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('is-open');
        question.setAttribute('aria-expanded', 'false');
        if (answer) answer.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  /* ==========================================================================
     7. Contact Form AJAX Submission (Formspree to Gmail)
     [REVISION]: WhatsApp mentions removed; email (alfaizablebusines@gmail.com) as primary contact
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');
  const formErrorAlert = document.getElementById('formErrorAlert');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      formSuccessAlert.style.display = 'none';
      formErrorAlert.style.display = 'none';

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formSuccessAlert.style.display = 'block';
          contactForm.reset();
          formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Server error occurred during submission.');
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
        formErrorAlert.style.display = 'block';
        formErrorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } finally {
        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
        }
      }
    });
  }

  /* ==========================================================================
     8. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
});
