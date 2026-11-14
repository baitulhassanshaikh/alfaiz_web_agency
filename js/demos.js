/**
 * ============================================================================
 * ALFAIZ WEB AGENCY — PORTFOLIO DEMO MANAGEMENT SYSTEM
 * ============================================================================
 * 
 * Central data store & automatic rendering engine for all live demo websites.
 * 
 * ----------------------------------------------------------------------------
 * HOW TO ADD A NEW DEMO WEBSITE IN 3 EASY STEPS:
 * ----------------------------------------------------------------------------
 * 1. Take a screenshot of your new website and save it in:
 *    images/demos/your-demo-name.png
 * 
 * 2. Copy the template object below and paste it into the `portfolioDemos` array:
 * 
 *    {
 *      id: "my-new-demo",
 *      name: "My New Website Name",
 *      category: "Business", // Any category: "Clothing", "Restaurant", "School", "Real Estate", "SaaS", etc.
 *      description: "Clean description of the business website and its primary goals.",
 *      image: "images/demos/my-new-demo.png",
 *      liveUrl: "https://baitulhassanshaikh.github.io/my-new-demo/",
 *      featured: false
 *    },
 * 
 * 3. Save this file and refresh your browser!
 *    The new demo and its category filter tab will appear automatically.
 *    NO HTML EDITING REQUIRED.
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. PORTFOLIO DEMOS DATA ARRAY
     ========================================================================== */
  const portfolioDemos = [
    {
      id: "clothing-demo-01",
      name: "AL NOOR Clothing Store",
      category: "Clothing",
      description: "Modern fashion & e-commerce apparel store featuring product catalogs, curated collections, and responsive shopping UI.",
      image: "images/demos/clothing-demo-01.png",
      liveUrl: "https://baitulhassanshaikh.github.io/alfaiz-clothing-demo-01/",
      featured: true
    },
    {
      id: "restaurant-demo-01",
      name: "The Grand Table — Fine Dining",
      category: "Restaurant",
      description: "Luxury fine dining & culinary showcase with interactive menu, online table reservation, and chef highlights.",
      image: "images/demos/restaurant-demo-01.png",
      liveUrl: "https://baitulhassanshaikh.github.io/alfaiz-restaurant-demo-01/",
      featured: true
    },
    {
      id: "school-demo-01",
      name: "Elite Academy",
      category: "School",
      description: "Comprehensive educational institute portal featuring academic programs, online admissions, student portal, and faculty directory.",
      image: "images/demos/school-demo-01.png",
      liveUrl: "https://baitulhassanshaikh.github.io/alfaiz-school-demo-01/",
      featured: true
    },
    {
      id: "restaurant-demo-02",
      name: "The Grand Table — Bistro & Cafe",
      category: "Restaurant",
      description: "Modern casual restaurant & cafe platform featuring daily specials, customer testimonials, and direct order inquiries.",
      image: "images/demos/restaurant-demo-02.png",
      liveUrl: "https://baitulhassanshaikh.github.io/alfaiz-restaurant-demo-02/",
      featured: false
    },
    {
      id: "school-demo-02",
      name: "Apex International School",
      category: "School",
      description: "Interactive school & learning academy web platform featuring virtual campus tour, curriculum guides, and event calendar.",
      image: "images/demos/school-demo-02.png",
      liveUrl: "https://baitulhassanshaikh.github.io/alfaiz-school-demo-02/",
      featured: false
    }
    /*
     * ------------------------------------------------------------------------
     * TEMPLATE: Copy & paste this block to add your 6th, 7th, 8th demo:
     * ------------------------------------------------------------------------
     * ,
     * {
     *   id: "my-new-demo",
     *   name: "My New Website Name",
     *   category: "Business", // Any category: "Clothing", "Restaurant", "School", "Real Estate", "SaaS", etc.
     *   description: "Clean description of the business website and its primary goals.",
     *   image: "images/demos/my-new-demo.png",
     *   liveUrl: "https://baitulhassanshaikh.github.io/my-new-demo/",
     *   featured: false
     * }
     */
  ];

  /* ==========================================================================
     2. HELPER UTILITIES (XSS Safe Escaping & Clean Domain Extraction)
     ========================================================================== */
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function sanitizeUrl(url) {
    if (!url) return '#';
    const clean = String(url).trim();
    if (/^(https?:\/\/|\/|\.\/)/i.test(clean)) {
      return clean;
    }
    return 'https://' + clean;
  }

  function extractDisplayDomain(url) {
    try {
      const parsed = new URL(url);
      return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname.replace(/\/$/, '') : '');
    } catch (_) {
      return 'alfaizwebagency.com/demo';
    }
  }

  /* ==========================================================================
     3. CATEGORY ICON HELPER (SVG Icons for Visual Flair)
     ========================================================================== */
  function getCategoryIcon(category) {
    const cat = (category || '').toLowerCase().trim();
    switch (cat) {
      case 'clothing':
      case 'fashion':
      case 'apparel':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>`;
      case 'restaurant':
      case 'food':
      case 'cafe':
      case 'dining':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 8h1a4 4 0 010 8h-1"/>
          <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>`;
      case 'school':
      case 'education':
      case 'academy':
      case 'college':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>`;
      case 'business':
      case 'corporate':
      case 'agency':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>`;
      case 'ecommerce':
      case 'e-commerce':
      case 'shop':
      case 'store':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
        </svg>`;
      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>`;
    }
  }

  /* ==========================================================================
     4. STATE & FILTERING
     ========================================================================== */
  let activeFilter = 'all';

  function setFilter(newFilter) {
    activeFilter = (newFilter || 'all').toLowerCase().trim();

    // Update active class on filter buttons
    const filterButtons = document.querySelectorAll('#portfolioFilterBar .filter-btn');
    filterButtons.forEach(btn => {
      const isMatch = btn.getAttribute('data-filter') === activeFilter;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', String(isMatch));
    });

    // Render cards for the active filter
    renderPortfolioGrid(portfolioDemos, activeFilter);
  }

  /* ==========================================================================
     5. RENDER DYNAMIC CATEGORY FILTER BUTTONS
     ========================================================================== */
  function renderFilterBar(demos) {
    const filterContainer = document.getElementById('portfolioFilterBar');
    if (!filterContainer) return;

    // Dynamically collect all unique categories from available demos
    const categories = ['all'];
    demos.forEach(demo => {
      if (demo.category) {
        const cat = demo.category.trim();
        if (!categories.some(c => c.toLowerCase() === cat.toLowerCase())) {
          categories.push(cat);
        }
      }
    });

    filterContainer.innerHTML = '';

    categories.forEach(cat => {
      const isAll = cat.toLowerCase() === 'all';
      const label = isAll ? 'All Websites' : cat;
      const filterValue = cat.toLowerCase();
      const isActive = activeFilter === filterValue;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-btn ${isActive ? 'active' : ''}`;
      btn.setAttribute('data-filter', filterValue);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(isActive));
      btn.textContent = label;

      btn.addEventListener('click', () => {
        setFilter(filterValue);
      });

      filterContainer.appendChild(btn);
    });
  }

  /* ==========================================================================
     6. RENDER DYNAMIC PORTFOLIO DEMO CARDS
     ========================================================================== */
  function renderPortfolioGrid(demos, currentFilter) {
    const gridContainer = document.getElementById('portfolioGrid');
    if (!gridContainer) return;

    // Filter list
    const filtered = currentFilter === 'all'
      ? demos
      : demos.filter(d => (d.category || '').toLowerCase().trim() === currentFilter.toLowerCase());

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="portfolio-empty" style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem;">
          <div class="empty-icon" style="width: 48px; height: 48px; margin: 0 auto 1rem; color: var(--color-primary);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-navy-900); margin-bottom: 0.5rem;">No demos found in this category</h3>
          <p style="color: var(--color-text-muted); margin-bottom: 1.25rem;">We are continuously building new live demos. Check back soon or view all projects.</p>
          <button type="button" class="btn btn-outline btn-sm" id="resetDemoFilterBtn">View All Demos</button>
        </div>
      `;

      const resetBtn = document.getElementById('resetDemoFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => setFilter('all'));
      }
      return;
    }

    // Build cards HTML
    let html = '';
    filtered.forEach((demo, index) => {
      const displayDomain = extractDisplayDomain(demo.liveUrl);
      const iconSvg = getCategoryIcon(demo.category);
      const delayClass = `delay-${(index % 3) + 1}`;
      const safeId = escapeHtml(demo.id);
      const safeName = escapeHtml(demo.name);
      const safeCategory = escapeHtml(demo.category);
      const safeDesc = escapeHtml(demo.description);
      const safeLiveUrl = sanitizeUrl(demo.liveUrl);
      const safeImage = escapeHtml(demo.image);

      const imageTag = safeImage
        ? `<img
            src="${safeImage}"
            alt="${safeName} Preview"
            class="portfolio-img"
            loading="lazy"
            onerror="this.classList.add('is-hidden');"
          />`
        : '';

      html += `
        <article class="portfolio-card reveal reveal-up ${delayClass}" data-category="${escapeHtml((demo.category || '').toLowerCase())}" id="demo-card-${safeId}">
          <!-- Card Preview Area with Image & Branded Fallback -->
          <div class="portfolio-preview">
            <!-- Sleek Branded Fallback (Always ready in background; visible whenever image is missing) -->
            <div class="portfolio-fallback" aria-hidden="true">
              <div class="fallback-browser-bar">
                <div class="fallback-browser-dots">
                  <span class="fallback-dot dot-red"></span>
                  <span class="fallback-dot dot-yellow"></span>
                  <span class="fallback-dot dot-green"></span>
                </div>
                <span class="fallback-browser-url">${escapeHtml(displayDomain)}</span>
              </div>
              <div class="fallback-body">
                <div class="fallback-icon-wrap">
                  ${iconSvg}
                </div>
                <span class="fallback-cat-badge">${safeCategory}</span>
                <h4 class="fallback-title">${safeName}</h4>
              </div>
              <div class="fallback-footer">
                <span class="fallback-status">
                  <span class="status-pulse-dot"></span>
                  Live Demo Available
                </span>
              </div>
            </div>

            <!-- Preview Image (Gracefully hides on error, leaving clean fallback) -->
            ${imageTag}

            <!-- Desktop Hover Overlay with Instant Launch Link -->
            <div class="portfolio-overlay">
              <a
                href="${safeLiveUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary btn-sm overlay-btn"
                aria-label="Launch live preview for ${safeName} in a new tab"
              >
                <span>Live Preview</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Card Content Body -->
          <div class="portfolio-info">
            <div class="portfolio-meta">
              <span class="portfolio-category-pill">
                <span class="meta-icon">${iconSvg}</span>
                <span>${safeCategory}</span>
              </span>
              <span class="portfolio-status-pill">
                <span class="status-dot"></span>
                <span>Live Demo</span>
              </span>
            </div>

            <h3 class="portfolio-name">${safeName}</h3>
            <p class="portfolio-desc">${safeDesc}</p>

            <!-- Card Action Footer -->
            <div class="portfolio-card-footer">
              <a
                href="${safeLiveUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary btn-sm btn-block portfolio-launch-btn"
                aria-label="Open live preview of ${safeName} in a new tab"
              >
                <span>Live Preview</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
              </a>
            </div>
          </div>
        </article>
      `;
    });

    gridContainer.innerHTML = html;

    // Trigger scroll reveal observer for newly created cards
    if (window.portfolioRevealObserver) {
      gridContainer.querySelectorAll('.reveal').forEach(el => {
        window.portfolioRevealObserver.observe(el);
      });
    } else {
      setTimeout(() => {
        gridContainer.querySelectorAll('.portfolio-card').forEach(card => {
          card.classList.add('is-revealed');
        });
      }, 50);
    }
  }

  /* ==========================================================================
     7. INITIALIZATION
     ========================================================================== */
  function initPortfolio() {
    const filterContainer = document.getElementById('portfolioFilterBar');
    const gridContainer = document.getElementById('portfolioGrid');

    if (!filterContainer && !gridContainer) {
      return;
    }

    // Scroll reveal observer for dynamically created elements
    if ('IntersectionObserver' in window) {
      window.portfolioRevealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
      );
    }

    renderFilterBar(portfolioDemos);
    setFilter('all');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }

  // Global API: Available for adding demos dynamically via console or scripts
  window.portfolioDemos = portfolioDemos;
  window.reloadPortfolioDemos = () => {
    renderFilterBar(portfolioDemos);
    setFilter(activeFilter);
  };

})();
