// =================================
// Configuration & Global Variables
// =================================

const CONFIG = {
  TYPING_SPEED: 80,
  TYPING_DELAY: 1500,
  PARTICLES_COUNT: 60,
  SCROLL_THRESHOLD: 0.1,
  ANIMATION_DELAY: 100
};

let isLoading = true;
let currentSection = 'home';
let particlesArray = [];

// =================================
// Utility Functions
// =================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

const lerp = (start, end, factor) => start + factor * (end - start);

const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// =================================
// Loading Screen Manager
// =================================

class LoadingManager {
  constructor() {
    this.loadingScreen = $('#loadingScreen');
    this.progressBar = $('.progress-bar');
    this.loadingText = $('.loading-text');
    this.progress = 0;
    this.init();
  }

  init() {
    this.simulateLoading();
    window.addEventListener('load', () => {
      setTimeout(() => this.hideLoading(), 500);
    });
  }

  simulateLoading() {
    const messages = [
      'Inicializando componentes...',
      'Cargando assets...',
      'Preparando animaciones...',
      'Configurando tema dorado...',
      'Casi listo...',
      '¡Completado!'
    ];

    let messageIndex = 0;
    const loadingInterval = setInterval(() => {
      this.progress += getRandomInt(5, 15);
      
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(loadingInterval);
      }
      
      this.progressBar.style.width = `${this.progress}%`;
      
      if (messageIndex < messages.length) {
        this.loadingText.textContent = messages[messageIndex];
        messageIndex++;
      }
    }, 300);
  }

  hideLoading() {
    isLoading = false;
    this.loadingScreen.classList.add('fade-out');
    
    setTimeout(() => {
      this.loadingScreen.style.display = 'none';
      this.initializeApp();
    }, 500);
  }

  initializeApp() {
    new NavigationManager();
    new TypingEffect();
    new ScrollAnimations();
    // Disabled ParticlesManager to fix movement bugs
    // new ParticlesManager();
    new SkillsAnimations();
    new CodeEditor();
    new ContactForm();
    new StatsCounter();
    new SmoothScroll();
  }
}

// =================================
// Navigation Manager - Enhanced Mobile
// =================================

class NavigationManager {
  constructor() {
    this.navbar = $('#navbar');
    this.navToggle = $('#navToggle');
    this.navMenu = $('#navMenu');
    this.navLinks = $$('.nav-link');
    this.sections = $$('section');
    this.isMobile = window.innerWidth <= 768;
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    this.handleScroll();
    this.handleNavigation();
    this.handleMobileMenu();
    this.updateActiveSection();
    this.handleResize();
    this.preventBodyScroll();
  }

  handleScroll() {
    let lastScrollY = 0;
    let scrollTimer;

    window.addEventListener('scroll', throttle(() => {
      const currentScrollY = window.pageYOffset;

      // Navbar background with mobile consideration
      if (currentScrollY > (this.isMobile ? 50 : 100)) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }

      // Hide/show navbar (disabled on mobile when menu is open)
      if (!this.isMenuOpen) {
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          this.navbar.style.transform = 'translateY(-100%)';
        } else {
          this.navbar.style.transform = 'translateY(0)';
        }
      }

      lastScrollY = currentScrollY;
      this.updateActiveSection();

      // Clear scrolling class after scroll ends
      document.body.classList.add('scrolling');
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.body.classList.remove('scrolling');
      }, 100);
    }, 16), { passive: true });
  }

  handleNavigation() {
    this.navLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        // Allow default behavior for CV/download links or external files (PDFs)
        const href = link.getAttribute('href') || '';
        if (link.classList.contains('cv-download') || link.hasAttribute('download') || href.toLowerCase().endsWith('.pdf')) {
          // let the browser handle the download; on mobile the menu should still close
          this.closeMobileMenu();
          return;
        }

        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = $(targetId);
        
        if (targetSection) {
          this.scrollToSection(targetSection);
          this.closeMobileMenu();
          
          // Add visual feedback
          this.addClickFeedback(link);
        }
      });

      // Add touch feedback for mobile
      if (this.isMobile) {
        link.addEventListener('touchstart', () => {
          link.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        link.addEventListener('touchend', () => {
          setTimeout(() => {
            link.style.transform = '';
          }, 150);
        });
      }
    });
  }

  handleMobileMenu() {
    if (!this.navToggle) return;

    this.navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMobileMenu();
    });

    // Close on outside click (desktop) or swipe (mobile)
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && 
          !this.navToggle.contains(e.target) && 
          !this.navMenu.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Handle touch gestures for mobile menu
    if (this.isMobile) {
      this.handleTouchGestures();
    }
  }

  handleTouchGestures() {
    let startX = 0;
    let startY = 0;

    this.navMenu.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    this.navMenu.addEventListener('touchmove', (e) => {
      if (!this.isMenuOpen) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      // Close menu on left swipe
      if (diffX > 50 && Math.abs(diffY) < 100) {
        this.closeMobileMenu();
      }
    }, { passive: true });
  }

  scrollToSection(section) {
    const offsetTop = section.offsetTop - (this.isMobile ? 60 : 80);
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    this.navToggle.classList.toggle('active');
    this.navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (this.isMenuOpen) {
      document.body.classList.add('menu-open');
      this.navbar.style.transform = 'translateY(0)'; // Keep navbar visible
    } else {
      document.body.classList.remove('menu-open');
    }

    // Animate menu items
    if (this.isMenuOpen) {
      this.animateMenuItems();
    }
  }

  closeMobileMenu() {
    if (!this.isMenuOpen) return;
    
    this.isMenuOpen = false;
    this.navToggle.classList.remove('active');
    this.navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  animateMenuItems() {
    this.navLinks.forEach((link, index) => {
      link.style.opacity = '0';
      link.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        link.style.transition = 'all 0.3s ease';
        link.style.opacity = '1';
        link.style.transform = 'translateY(0)';
      }, index * 100 + 200);
    });
  }

  addClickFeedback(element) {
    element.style.background = 'var(--gold-primary)';
    element.style.color = 'var(--primary-bg)';
    
    setTimeout(() => {
      element.style.background = '';
      element.style.color = '';
    }, 200);
  }

  updateActiveSection() {
    let current = '';
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - (this.isMobile ? 120 : 150);
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop && 
          window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    if (current !== currentSection) {
      currentSection = current;
      this.highlightActiveLink();
    }
  }

  highlightActiveLink() {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  handleResize() {
    window.addEventListener('resize', debounce(() => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      
      // Close mobile menu if switching to desktop
      if (wasMobile && !this.isMobile && this.isMenuOpen) {
        this.closeMobileMenu();
      }
      
      // Reset styles when switching between mobile/desktop
      if (wasMobile !== this.isMobile) {
        this.navLinks.forEach(link => {
          link.style.opacity = '';
          link.style.transform = '';
          link.style.transition = '';
        });
      }
    }, 250));
  }

  preventBodyScroll() {
    // CSS handles this, but add JS backup
    const style = document.createElement('style');
    style.textContent = `
      .menu-open {
        overflow: hidden;
        position: fixed;
        width: 100%;
      }
      
      .touch-active {
        transform: scale(0.95) !important;
        transition: transform 0.1s ease;
      }
      
      .scrolling * {
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }
}

// =================================
// Typing Effect
// =================================

class TypingEffect {
  constructor() {
    this.typingElement = $('#typingText');
    this.texts = [
      'Full Stack Developer',
      'Desarrollador',
      'Freelancer'
    ];
    this.currentIndex = 0;
    this.isDeleting = false;
    this.text = '';
    this.init();
  }

  init() {
    if (this.typingElement) {
      setTimeout(() => this.type(), 1000);
    }
  }

  type() {
    const fullText = this.texts[this.currentIndex];
    
    if (this.isDeleting) {
      this.text = fullText.substring(0, this.text.length - 1);
    } else {
      this.text = fullText.substring(0, this.text.length + 1);
    }
    
    this.typingElement.textContent = this.text;
    
    let typeSpeed = this.isDeleting ? 50 : CONFIG.TYPING_SPEED;
    
    if (!this.isDeleting && this.text === fullText) {
      typeSpeed = CONFIG.TYPING_DELAY;
      this.isDeleting = true;
    } else if (this.isDeleting && this.text === '') {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.texts.length;
      typeSpeed = 200;
    }
    
    setTimeout(() => this.type(), typeSpeed);
  }
}

// =================================
// Particles Manager (DISABLED)
// =================================

class ParticlesManager {
  constructor() {
    this.container = $('.golden-particles');
    this.particles = [];
    // Animation disabled to fix performance issues
    // this.init();
  }

  init() {
    // Particles animation disabled
    // this.createParticles();
    // this.animate();
    // this.handleResize();
  }

  createParticles() {
    // Disabled - was causing performance issues
  }

  createParticle() {
    // Disabled - was causing performance issues
  }

  animate() {
    // Animation loop disabled to prevent bugs
  }

  handleResize() {
    window.addEventListener('resize', debounce(() => {
      this.particles.forEach(particle => {
        if (particle.x > window.innerWidth) {
          particle.x = window.innerWidth;
        }
        if (particle.y > window.innerHeight) {
          particle.y = window.innerHeight;
        }
      });
    }, 250));
  }
}

// =================================
// Scroll Animations
// =================================

class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    this.createObserver();
    this.observeElements();
  }

  createObserver() {
    const options = {
      threshold: CONFIG.SCROLL_THRESHOLD,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('fade-in');
          }, index * CONFIG.ANIMATION_DELAY);
        }
      });
    }, options);
  }

  observeElements() {
    const elementsToObserve = [
      '.section-header',
      '.about-text',
      '.stat-card',
      '.skill-category',
      '.project-card',
      '.timeline-item',
      '.contact-info',
      '.contact-form'
    ];

    elementsToObserve.forEach(selector => {
      $$(selector).forEach(element => {
        this.observer.observe(element);
      });
    });
  }
}

// =================================
// Skills Animations
// =================================

class SkillsAnimations {
  constructor() {
    this.skillBars = $$('.skill-progress');
    this.observer = null;
    this.init();
  }

  init() {
    this.createObserver();
    this.observeSkills();
  }

  createObserver() {
    const options = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSkillBar(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeSkills() {
    this.skillBars.forEach(skillBar => {
      this.observer.observe(skillBar);
    });
  }

  animateSkillBar(skillBar) {
    const progress = skillBar.dataset.progress;
    
    setTimeout(() => {
      skillBar.style.width = `${progress}%`;
    }, 300);
  }
}

// =================================
// Code Editor Animation
// =================================

class CodeEditor {
  constructor() {
    this.codeElement = $('#codeAnimation');
    this.codeLines = [
      'const developer = {',
      '  nombre: "Kevin",',
      '  rol: "Desarrollador",',
      '  stack: [',
      '    "JavaScript", "Node.js",',
      '    "Python", "MySQL", "Java","C#"',
      '  ],',
      '   pasion: "Desarrollador Web"',
    ];
    this.currentLine = 0;
    this.init();
  }

  init() {
    if (this.codeElement) {
      setTimeout(() => this.animateCode(), 2000);
    }
  }

  animateCode() {
    if (this.currentLine < this.codeLines.length) {
      const line = this.codeLines[this.currentLine];
      this.typeLine(line, () => {
        this.currentLine++;
        setTimeout(() => this.animateCode(), 500);
      });
    } else {
      setTimeout(() => {
        this.codeElement.textContent = '';
        this.currentLine = 0;
        this.animateCode();
      }, 4000);
    }
  }

  typeLine(line, callback) {
    let charIndex = 0;
    const currentContent = this.codeElement.textContent;
    
    const typeChar = () => {
      if (charIndex <= line.length) {
        this.codeElement.textContent = currentContent + line.substring(0, charIndex);
        charIndex++;
        setTimeout(typeChar, 50);
      } else {
        this.codeElement.textContent = currentContent + line + '\n';
        callback();
      }
    };
    
    typeChar();
  }
}

// =================================
// Stats Counter
// =================================

class StatsCounter {
  constructor() {
    this.stats = $$('[data-count]');
    this.observer = null;
    this.init();
  }

  init() {
    this.createObserver();
    this.observeStats();
  }

  createObserver() {
    const options = {
      threshold: 0.7,
      rootMargin: '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeStats() {
    this.stats.forEach(stat => {
      this.observer.observe(stat);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    requestAnimationFrame(updateCounter);
  }
}

// =================================
// Contact Form Handler
// =================================

class ContactForm {
  constructor() {
    this.form = $('#contactForm');
    this.inputs = $$('.form-group input, .form-group textarea');
    this.submitBtn = $('.btn-submit');
    this.init();
  }

  init() {
    if (this.form) {
      this.handleForm();
      this.handleInputs();
    }
  }

  handleForm() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitForm();
    });
  }

  handleInputs() {
    this.inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        if (!input.value.trim()) {
          input.parentElement.classList.remove('focused');
        }
      });

      input.addEventListener('input', () => {
        this.validateField(input);
      });
    });
  }

  validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;

    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    } else {
      isValid = value.length > 0;
    }

    input.classList.toggle('error', !isValid);
    return isValid;
  }

  async submitForm() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    let isValid = true;
    this.inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showMessage('Por favor, completa todos los campos correctamente.', 'error');
      return;
    }

    // Show loading state
    this.setSubmitState('loading');

    try {
      // Simulate API call
      await this.simulateSubmit(data);
      this.setSubmitState('success');
      this.form.reset();
      this.showMessage('¡Mensaje enviado correctamente!', 'success');
    } catch (error) {
      this.setSubmitState('error');
      this.showMessage('Error al enviar el mensaje. Intenta de nuevo.', 'error');
    }
  }

  async simulateSubmit(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success (90% of the time)
        if (Math.random() > 0.1) {
          console.log('Form submitted:', data);
          resolve();
        } else {
          reject(new Error('Submission failed'));
        }
      }, 2000);
    });
  }

  setSubmitState(state) {
    const btnText = this.submitBtn.querySelector('span');
    const btnIcon = this.submitBtn.querySelector('i');

    this.submitBtn.disabled = state === 'loading';

    switch (state) {
      case 'loading':
        btnText.textContent = 'Enviando...';
        btnIcon.className = 'fas fa-spinner fa-spin';
        break;
      case 'success':
        btnText.textContent = '¡Enviado!';
        btnIcon.className = 'fas fa-check';
        setTimeout(() => this.resetSubmitButton(), 3000);
        break;
      case 'error':
        btnText.textContent = 'Error';
        btnIcon.className = 'fas fa-exclamation-triangle';
        setTimeout(() => this.resetSubmitButton(), 3000);
        break;
    }
  }

  resetSubmitButton() {
    const btnText = this.submitBtn.querySelector('span');
    const btnIcon = this.submitBtn.querySelector('i');
    
    btnText.textContent = 'Enviar Mensaje';
    btnIcon.className = 'fas fa-paper-plane';
    this.submitBtn.disabled = false;
  }

  showMessage(message, type) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#ffd700' : '#ff6b6b'};
      color: ${type === 'success' ? '#000' : '#fff'};
      padding: 1rem 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// =================================
// Smooth Scroll Enhancement
// =================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Enhanced smooth scrolling for all anchor links
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        const target = $(href);
        
        if (target) {
          e.preventDefault();
          this.scrollToElement(target);
        }
      });
    });
  }

  scrollToElement(element) {
    const offsetTop = element.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = offsetTop - startPosition;
    const duration = 800;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function
      const easeInOutCubic = progress < 0.5
        ? 4 * progress * progress * progress
        : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;

      window.scrollTo(0, startPosition + distance * easeInOutCubic);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }
}

//  =================================
// Scroll To Top Button
// =================================

class ScrollToTop {
  constructor() {
    this.button = null;
    this.isVisible = false;
    this.init();
  }

  init() {
    this.createButton();
    this.handleScroll();
    this.handleClick();
  }

  createButton() {
    this.button = document.createElement('button');
    this.button.id = 'scrollToTop';
    this.button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    this.button.setAttribute('aria-label', 'Volver arriba');
    this.button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: var(--gold-primary);
      color: var(--primary-bg);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      z-index: 1000;
      transform: scale(0);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 20px rgba(255, 193, 7, 0.3);
    `;
    
    // Add hover effect
    this.button.addEventListener('mouseenter', () => {
      if (this.isVisible) {
        this.button.style.transform = 'scale(1.1)';
        this.button.style.boxShadow = '0 6px 25px rgba(255, 193, 7, 0.4)';
      }
    });
    
    this.button.addEventListener('mouseleave', () => {
      if (this.isVisible) {
        this.button.style.transform = 'scale(1)';
        this.button.style.boxShadow = '0 4px 20px rgba(255, 193, 7, 0.3)';
      }
    });

    document.body.appendChild(this.button);
  }

  handleScroll() {
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.pageYOffset;
      const shouldShow = scrollY > 300;

      if (shouldShow && !this.isVisible) {
        this.show();
      } else if (!shouldShow && this.isVisible) {
        this.hide();
      }
    }, 16));
  }

  handleClick() {
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Add click animation
      this.button.style.transform = 'scale(0.9)';
      setTimeout(() => {
        this.button.style.transform = this.isVisible ? 'scale(1)' : 'scale(0)';
      }, 150);
    });
  }

  show() {
    this.isVisible = true;
    this.button.style.transform = 'scale(1)';
  }

  hide() {
    this.isVisible = false;
    this.button.style.transform = 'scale(0)';
  }
}

//  =================================
// Performance Monitor - Enhanced for Mobile
// =================================

class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.lastTime = performance.now();
    this.isMobile = window.innerWidth <= 768;
    this.touchDevice = 'ontouchstart' in window;
    this.init();
  }

  init() {
    if ('requestIdleCallback' in window) {
      this.monitorPerformance();
    }
    this.optimizeForDevice();
    this.handleOrientationChange();
    this.addMobileEnhancements();
  }

  monitorPerformance() {
    const monitor = () => {
      const currentTime = performance.now();
      this.fps = 1000 / (currentTime - this.lastTime);
      this.lastTime = currentTime;

      // Reduce animations if performance is poor
      if (this.fps < 30) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }

      requestIdleCallback(monitor);
    };

    requestIdleCallback(monitor);
  }

  optimizeForDevice() {
    // Mobile optimizations
    if (this.isMobile) {
      CONFIG.PARTICLES_COUNT = 0; // Disable particles on mobile
      CONFIG.ANIMATION_DELAY = 50; // Faster animations on mobile
      document.body.classList.add('mobile-device');
    }

    // Touch device optimizations
    if (this.touchDevice) {
      document.body.classList.add('touch-device');
      // Add touch-friendly styles
      document.documentElement.style.setProperty('--touch-target-size', '44px');
    }

    // Respect user preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduce-motion');
    }

    // High contrast mode
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.body.classList.add('high-contrast');
    }
  }

  handleOrientationChange() {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.isMobile = window.innerWidth <= 768;
        
        // Trigger resize event for other components
        window.dispatchEvent(new Event('resize'));
        
        // Recalculate viewport heights
        this.updateViewportHeight();
      }, 100);
    });
  }

  updateViewportHeight() {
    // Fix mobile viewport height issues
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  addMobileEnhancements() {
    if (this.isMobile) {
      // Scroll-to-top button handled by ScrollToTop class
      // this.addScrollToTop();
      this.improveScrollPerformance();
      this.addTouchFeedback();
    }
  }

  // addScrollToTop() method removed - handled by dedicated ScrollToTop class
  /*
  addScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(scrollBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, 100));

    // Scroll to top functionality
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  */

  improveScrollPerformance() {
    // Use passive event listeners for better scroll performance
    let scrollTimer;
    
    window.addEventListener('scroll', () => {
      document.body.classList.add('scrolling');
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.body.classList.remove('scrolling');
      }, 100);
    }, { passive: true });
  }

  addTouchFeedback() {
    // Add touch feedback to interactive elements
    const touchElements = $$('.btn, .nav-link, .social-link, .project-card, .skill-item');
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', () => {
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
    });
  }
}

// =================================
// Additional CSS Animations
// =================================

const additionalStyles = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .reduce-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .form-group input.error,
  .form-group textarea.error {
    border-color: #ff6b6b;
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// =================================
// Initialize Application
// =================================

document.addEventListener('DOMContentLoaded', () => {
  // Start loading screen
  new LoadingManager();
  
  // Initialize performance monitoring
  new PerformanceMonitor();
  
  // Initialize scroll to top button
  new ScrollToTop();
  
  // Add some nice touches
  console.log('%c🌟 Portfolio loaded successfully! 🌟', 'color: #ffd700; font-size: 16px; font-weight: bold;');
  console.log('%cMade with ❤️ and lots of ☕', 'color: #ffa500; font-size: 12px;');
});

// =================================
// Error Handling
// =================================

window.addEventListener('error', (e) => {
  console.error('An error occurred:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// =================================
// Custom Notification System
// =================================

class NotificationSystem {
  constructor() {
    this.overlay = null;
    this.init();
  }

  init() {
    this.createOverlay();
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'notification-overlay';
    document.body.appendChild(this.overlay);
  }

  show(title, message, type = 'success', duration = 4000) {
    const iconMap = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-triangle'
    };

    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
      <div class="notification-icon ${type}">
        <i class="${iconMap[type]}"></i>
      </div>
      <h3 class="notification-title">${title}</h3>
      <p class="notification-message">${message}</p>
      <button class="notification-button" onclick="notificationSystem.hide()">
        Aceptar
      </button>
    `;

    this.overlay.innerHTML = '';
    this.overlay.appendChild(modal);
    this.overlay.classList.add('active');

    // Auto hide after duration
    if (duration > 0) {
      setTimeout(() => {
        this.hide();
      }, duration);
    }

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });

    // Close on escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.hide();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  hide() {
    this.overlay.classList.remove('active');
  }

  success(title, message, duration = 4000) {
    this.show(title, message, 'success', duration);
  }

  error(title, message, duration = 5000) {
    this.show(title, message, 'error', duration);
  }

  info(title, message, duration = 4000) {
    this.show(title, message, 'info', duration);
  }

  warning(title, message, duration = 4000) {
    this.show(title, message, 'warning', duration);
  }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();

// =================================
// EmailJS Integration
// =================================

document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se recargue

    emailjs.init('4khizwz-QJfRjqcTZ'); // Tu Public Key

    const serviceID = 'service_36nhw1s'; // Tu Service ID
    const templateID = 'template_0cdrfon'; // Tu Template ID

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
    };

    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Enviando...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    emailjs.send(serviceID, templateID, formData)
        .then(() => {
            notificationSystem.success(
                '¡Mensaje Enviado!',
                'Tu mensaje ha sido enviado exitosamente. Te responderé pronto.',
                5000
            );
            document.getElementById('contactForm').reset(); // Limpia el formulario
        })
        .catch((error) => {
            console.error('Error al enviar el mensaje:', error);
            notificationSystem.error(
                'Error al Enviar',
                'Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente o contáctame directamente.',
                6000
            );
        })
        .finally(() => {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
});
