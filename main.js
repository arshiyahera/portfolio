/**
 * Arshiya Hera Portfolio - Main JavaScript
 * Handles smooth scrolling, navbar scroll state, mobile menu toggle,
 * tab switching, skill/project filtering, modal views, counter animations,
 * copy-to-clipboard, and form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initStatCounters();
  initAboutTabs();
  initSkillFilters();
  initProjectFilters();
  initProjectModals();
  initContactForm();
  initEmailCopy();
  initCurrentYear();
});

/* ==========================================================================
   1. Navbar Scroll State
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile Navigation Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking a navigation link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. Active Navigation ScrollSpy
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ==========================================================================
   4. Animated Stat Counters
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const runCounterAnimation = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1200; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(ease * target);
        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounterAnimation();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const straddleContainer = document.querySelector('.hero-straddle-container');
  if (straddleContainer) {
    observer.observe(straddleContainer);
  }
}

/* ==========================================================================
   5. About Section Tab Switching
   ========================================================================== */
function initAboutTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');

      // Update button active state
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update pane visibility
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `pane-${tabTarget}`) {
          pane.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   6. Skill Filter Chips
   ========================================================================== */
function initSkillFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const skillCards = document.querySelectorAll('.skill-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-skill-filter');

      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Projects Filter
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.split(' ').includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Project Detail Modal Data & Interactions
   ========================================================================== */
const projectDetailsData = {
  academic: {
    title: "Academic Apocalypse",
    category: "Game Development & Interactive Simulation",
    image: "assets/project-quest.jpg",
    tags: ["C", "Raylib", "2D Game Dev", "Collision Detection", "Mini-Games"],
    description: "A 2D adventure game developed in C using the Raylib library. Players navigate through eight semester-themed game worlds, facing interactive challenges, academic quests, and specialized mini-games reflecting student life and progression.",
    features: [
      "8 distinct semester-themed game worlds with progressive challenges and thematic assets.",
      "Top-down maze navigation featuring custom tile collision detection and movement mechanics.",
      "Interactive quiz mini-game testing coursework knowledge to advance through gates.",
      "Coffee drag-and-drop mini-game utilizing real-time mouse interaction and physics bounds.",
      "ATM/salary mini-game handling resource management and in-game economy.",
      "Custom game state management and clean procedural C architecture."
    ],
    demoLink: "https://github.com/lipglossuserr/academic-apocalypse",
    githubLink: "https://github.com/lipglossuserr/academic-apocalypse"
  },
  aetna: {
    title: "Aetna Game Engine",
    category: "Game Engine Architecture & C++ Systems",
    image: "assets/project-aetna.jpg",
    tags: ["C++", "OOP Architecture", "Game Loop", "Event Dispatcher", "Modular Systems"],
    description: "A modular 2D game engine framework designed to provide reusable, decoupled systems for rapid 2D game prototyping. Built with strict object-oriented design and performance considerations in modern C++.",
    features: [
      "Modular game engine architecture separating rendering, physics update steps, and entity logic.",
      "Deterministic game loop with fixed-step updates and variable-rate interpolation.",
      "Event-driven architecture allowing loosely coupled communication across game systems.",
      "Reusable component-entity management facilitating easy addition of new game behaviors.",
      "Clean object-oriented design adhering to solid software engineering principles."
    ],
    demoLink: "https://github.com/Shira-yuki23/CookN",
    githubLink: "https://github.com/Shira-yuki23/CookN"
  },
  carbondraw: {
    title: "CarbonDraw: Climate-Action Roguelike Deck-Builder",
    category: "Educational Climate Roguelike & Interactive Simulation",
    image: "assets/project-carbondraw.jpg",
    tags: ["Java", "JavaFX", "Roguelike", "Systems Thinking", "Project Drawdown", "Deck-Building"],
    description: "CarbonDraw is an educational climate-action roguelike deck-building game built with Java and JavaFX. It gamifies real-world climate solutions and Project Drawdown data, allowing players to build card combinations, explore technology and policy synergies, and learn systems thinking through strategic gameplay.",
    features: [
      "Strategic roguelike deck-building loop where players draft and play real-world climate intervention cards.",
      "Empirical Project Drawdown data integration, modeling emissions reduction, gigatons, and financial costs.",
      "Technology and policy synergy engine rewarding systems thinking and cross-sector planning.",
      "Dynamic climate crisis encounters and branching environmental policy scenarios.",
      "Rich JavaFX graphical interface with interactive card layout styling and real-time impact metrics."
    ],
    demoLink: "https://github.com/Yakiyo/carbondraw",
    githubLink: "https://github.com/Yakiyo/carbondraw"
  },
  movie: {
    title: "JavaFX Movie Browser",
    category: "Desktop Application & Relational Database Integration",
    image: "assets/project-movie.jpg",
    tags: ["Java", "JavaFX", "FXML", "CSS", "MySQL", "JDBC"],
    description: "A desktop movie cataloging and exploration application built using JavaFX and FXML, integrated with a MySQL database via JDBC to manage, filter, and view movie collections, posters, and details.",
    features: [
      "Intuitive movie browsing and search interface designed with FXML and custom CSS styling.",
      "Comprehensive movie detail view displaying synopsis, release years, cast, and high-resolution posters.",
      "Robust relational database integration with MySQL leveraging JDBC for reliable SQL querying.",
      "Structured MVC desktop architecture separating data access, controller logic, and UI scenes.",
      "Prepared statements and parameterized queries ensuring secure database interaction."
    ],
    demoLink: "https://github.com/arshiyahera",
    githubLink: "https://github.com/arshiyahera"
  },
  future1: {
    title: "Future Project Slot 01",
    category: "Upcoming Development",
    image: "assets/project-quest.jpg",
    tags: ["Coming Soon", "Software Engineering", "IUT Coursework"],
    description: "This slot is reserved for an upcoming software project currently in planning. The modular portfolio layout makes it seamless to link the GitHub repository, live demo, and screenshots once ready.",
    features: [
      "Project space reserved for semester coursework or hackathon prototype.",
      "Easily configurable inside index.html and main.js in just a few lines.",
      "Consistent responsive card layout with interactive modal viewer."
    ],
    demoLink: "https://github.com/arshiyahera",
    githubLink: "https://github.com/arshiyahera"
  },
  future2: {
    title: "Future Project Slot 02",
    category: "Upcoming Exploration",
    image: "assets/project-aetna.jpg",
    tags: ["Coming Soon", "Algorithms", "Systems"],
    description: "Currently exploring and building something new in computational problem solving, data structures, or system development.",
    features: [
      "Reserved for algorithms or systems programming exploration.",
      "Supports code snippets, live links, and media previews upon release."
    ],
    demoLink: "https://github.com/arshiyahera",
    githubLink: "https://github.com/arshiyahera"
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');
  const openButtons = document.querySelectorAll('.open-modal-btn');

  if (!modal || !modalBody) return;

  const openModal = (projectId) => {
    const data = projectDetailsData[projectId] || projectDetailsData.academic;
    const isContain = projectId === 'carbondraw' ? 'modal-thumb-contain' : '';

    const tagsHtml = data.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');
    const featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');

    modalBody.innerHTML = `
      <div class="modal-img-wrap">
        <img src="${data.image}" alt="${data.title}" class="${isContain}" loading="lazy">
      </div>
      <span class="section-subtitle">${data.category}</span>
      <h3 class="modal-title" id="modalTitle">${data.title}</h3>
      <div class="modal-tag-row">${tagsHtml}</div>
      <p class="modal-description">${data.description}</p>
      <h4 class="modal-features-title">Technical Highlights &amp; Features</h4>
      <ul class="modal-features-list">${featuresHtml}</ul>
      <div class="modal-actions">
        <a href="${data.githubLink}" class="btn btn-sm btn-outline-purple">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          GitHub Repository
        </a>
        <a href="${data.demoLink}" class="btn btn-sm btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
          Live / Demo Link
        </a>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. Interactive Contact Form with Validation & Feedback Toast
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const setGroupError = (input, isValid) => {
    const group = input.closest('.form-group');
    if (!group) return;
    if (isValid) {
      group.classList.remove('has-error');
    } else {
      group.classList.add('has-error');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setGroupError(nameInput, false);
      isValid = false;
    } else {
      setGroupError(nameInput, true);
    }

    // Validate Email
    if (!validateEmail(emailInput.value.trim())) {
      setGroupError(emailInput, false);
      isValid = false;
    } else {
      setGroupError(emailInput, true);
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setGroupError(subjectInput, false);
      isValid = false;
    } else {
      setGroupError(subjectInput, true);
    }

    // Validate Message (min 15 chars)
    if (messageInput.value.trim().length < 15) {
      setGroupError(messageInput, false);
      isValid = false;
    } else {
      setGroupError(messageInput, true);
    }

    if (!isValid) return;

    // Simulate submission
    const submitBtn = document.getElementById('submitFormBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending...</span>`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      const userName = nameInput.value.trim().split(' ')[0] || 'there';
      form.reset();

      // Clear any errors
      [nameInput, emailInput, subjectInput, messageInput].forEach(inp => setGroupError(inp, true));

      // Show toast
      showToast(`Thank you, ${userName}! Your message has been sent successfully. I'll get back to you soon.`, 'success');
    }, 800);
  });
}

/* ==========================================================================
   10. Copy-to-Clipboard Email Feature
   ========================================================================== */
function initEmailCopy() {
  const setupCopy = (btnId, elemId, label) => {
    const btn = document.getElementById(btnId);
    const elem = document.getElementById(elemId);
    if (!btn || !elem) return;

    btn.addEventListener('click', () => {
      const email = elem.textContent.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`${label} copied to clipboard!`, 'info');
        }).catch(() => {
          fallbackCopy(email, label);
        });
      } else {
        fallbackCopy(email, label);
      }
    });
  };

  setupCopy('copyEmailBtn', 'emailAddress', 'Personal email (arshiya.hera@gmail.com)');
  setupCopy('copyIutEmailBtn', 'iutEmailAddress', 'IUT email (arshiyasaryn@iut-dhaka.edu)');

  function fallbackCopy(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`${label} copied to clipboard!`, 'info');
    } catch (err) {
      showToast("Email: " + text, 'info');
    }
    document.body.removeChild(textArea);
  }
}

/* ==========================================================================
   11. Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   12. Current Year in Footer
   ========================================================================== */
function initCurrentYear() {
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
