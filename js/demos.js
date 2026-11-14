/**
 * ============================================================================
 * ALFAIZ WEB AGENCY — DYNAMIC DEMO PORTFOLIO & CATEGORY MANAGEMENT SYSTEM
 * ============================================================================
 * 
 * Central data store & automatic rendering engine for all live demo websites
 * and portfolio categories.
 * 
 * ----------------------------------------------------------------------------
 * 1. HOW TO MANAGE CATEGORIES:
 * ----------------------------------------------------------------------------
 * Edit the `demoCategories` array below:
 * - ADD a category: Add `{ id: "mycategory", name: "My Category Name" }`
 * - RENAME a category: Change `name: "New Name"` (cards & tabs update instantly)
 * - REORDER categories: Change their position in the array
 * - REMOVE a category: Remove it from the array
 * 
 * NOTE: The 'All' category is permanent and will always be safely available.
 * If you remove a category that demos still reference, those demos are NEVER
 * lost — they are safely preserved in 'All' and under a fallback tab.
 * 
 * ----------------------------------------------------------------------------
 * 2. HOW TO ADD A NEW DEMO WEBSITE:
 * ----------------------------------------------------------------------------
 * 1. Add your screenshot image into: images/demos/your-demo-name.png
 * 2. Copy the template object into `portfolioDemos` below:
 * 
 *    {
 *      id: "my-demo-01",
 *      name: "My Business Website",
 *      category: "business", // Match any category id from demoCategories
 *      description: "Clean description of the business website and its features.",
 *      image: "images/demos/my-demo-01.png",
 *      liveUrl: "https://baitulhassanshaikh.github.io/my-demo-01/",
 *      featured: false
 *    },
 * 
 * 3. Save this file and refresh your browser!
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. DEMO CATEGORIES CONFIGURATION
     ========================================================================== */
  const demoCategories = [
    { id: "all", name: "All" },
    { id: "clothing", name: "Clothing" },
    { id: "restaurant", name: "Restaurant" },
    { id: "school", name: "School" },
  ];

  /* ==========================================================================
     2. PORTFOLIO DEMOS DATA ARRAY
     ========================================================================== */
  const portfolioDemos = [
    {
      id: "clothing-demo-01",
      name: "AL NOOR Clothing Store",
      category: "clothing",
      description: "Modern fashion & e-commerce apparel store featuring product catalogs, curated collections, and responsive shopping UI.",
      image: "images/demos/alfaiz-clothing-demo-01.png",
      liveUrl: "https://baitulhassanshaikh.github.io/alfaiz-clothing-demo-01/",
      featured: true
    },
    {
      id: "restaurant-demo-01",
      name: "The Grand Table — Fine Dining",
      category: "restaurant",
      description: "Luxury fine dining & culinary showcase with interactive menu, online table reservation, and chef highlights.",
      image: "images/demos/alfaiz-clothing-demo-02.png",
      liveUrl: "https://baitulhassanshaikh.github.io/alfaiz-restaurant-demo-01/",
      featured: true
    },
    {
      id: "school-demo-01",
      name: "Elite Academy",
      category: "school",
      description: "Comprehensive educational institute portal featuring academic programs, online admissions, student portal, and faculty directory.",
      image: "images/demos/eliteacademy.png",
      liveUrl: "https://baitulhassanshaikh.github.io/alfaiz-school-demo-01/",
      featured: true
    },
    {
      id: "restaurant-demo-02",
      name: "The Grand Table — Bistro & Cafe",
      category: "restaurant",
      description: "Modern casual restaurant & cafe platform featuring daily specials, customer testimonials, and direct order inquiries.",
      image: "images/demos/alfaiz-dinner-01.png",
      liveUrl: "https://baitulhassanshaikh.github.io/alfaiz-restaurant-demo-02/",
      featured: false
    },
    {
      id: "school-demo-02",
      name: "Apex International School",
      category: "school",
      description: "Interactive school & learning academy web platform featuring virtual campus tour, curriculum guides, and event calendar.",
      image: "images/demos/school.png",
      liveUrl: "https://baitulhassanshaikh.github.io/alfaiz-school-demo-02/",
      featured: false
    }
  ];

  /* ==========================================================================
     3. HELPER UTILITIES (XSS Safe Escaping & Clean Domain Extraction)
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
     4. CATEGORY RESOLUTION & SAFETY ENGINE
     ========================================================================== */
  /**
   * Resolves categories safely:
   * 1. Guarantees 'All' is permanently present at index 0.
   * 2. Detects any demos assigned to missing/deleted categories and auto-retains
   *    them with a safe fallback filter + clear console warning.
   */
  const warnedOrphanCategories = new Set();

  function getResolvedCategories() {
    let list = Array.isArray(demoCategories) ? [...demoCategories] : [];

    // Ensure 'all' is always present and first
    const allIdx = list.findIndex(c => (c.id || '').toLowerCase().trim() === 'all');
    if (allIdx === -1) {
      list.unshift({ id: 'all', name: 'All' });
    } else if (allIdx > 0) {
      const [allItem] = list.splice(allIdx, 1);
      list.unshift(allItem);
    }

    // Safety validation for demos assigned to unknown / removed categories
    const knownCatIds = new Set(list.map(c => (c.id || '').toLowerCase().trim()));
    const orphanedMap = new Map();

    portfolioDemos.forEach(demo => {
      const rawCat = (demo.category || '').toLowerCase().trim();
      if (rawCat && rawCat !== 'all' && !knownCatIds.has(rawCat)) {
        if (!orphanedMap.has(rawCat)) {
          orphanedMap.set(rawCat, []);
        }
        orphanedMap.get(rawCat).push(demo);
      }
    });

    if (orphanedMap.size > 0) {
      orphanedMap.forEach((demos, catId) => {
        if (!warnedOrphanCategories.has(catId)) {
          warnedOrphanCategories.add(catId);
          console.warn(
            `[ALFAIZ Demos Safety Notice]: Category "${catId}" is not registered in demoCategories, but is referenced by ${demos.length} demo(s): [${demos.map(d => d.name || d.title || d.id).join(', ')}]. Demos are safely preserved in "All" and under the fallback filter.`
          );
        }
        const fallbackName = catId.charAt(0).toUpperCase() + catId.slice(1);
        list.push({
          id: catId,
          name: fallbackName,
          isFallback: true
        });
      });
    }

    return list;
  }

  /**
   * Returns human-readable category name from ID
   */
  function getCategoryDisplayName(catId) {
    if (!catId) return 'Website';
    const resolved = getResolvedCategories();
    const match = resolved.find(c => (c.id || '').toLowerCase().trim() === String(catId).toLowerCase().trim());
    if (match && match.name) return match.name;
    const raw = String(catId);
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  /* ==========================================================================
     5. CATEGORY ICON HELPER (SVG Icons for Visual Flair)
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
     6. ENVIRONMENT & STATE
     ========================================================================== */
  const isArchivePage = Boolean(
    document.getElementById('demoSearchInput') ||
    document.body.classList.contains('page-archive') ||
    (typeof window !== 'undefined' && window.location && window.location.pathname.endsWith('demos.html'))
  );

  let activeFilter = 'all';
  let searchQuery = '';

  // Parse initial query params (e.g. ?category=restaurant or ?q=cafe)
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      const qParam = urlParams.get('q') || urlParams.get('search');
      if (catParam) {
        activeFilter = catParam.toLowerCase().trim();
      }
      if (qParam) {
        searchQuery = qParam.trim();
      }
    } catch (_) { }
  }

  function setFilter(newFilter) {
    activeFilter = (newFilter || 'all').toLowerCase().trim();

    // Update active class on filter buttons
    const filterButtons = document.querySelectorAll('#portfolioFilterBar .filter-btn');
    filterButtons.forEach(btn => {
      const isMatch = btn.getAttribute('data-filter') === activeFilter;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', String(isMatch));
    });

    renderPortfolio();
  }

  /* ==========================================================================
     7. RENDER DYNAMIC CATEGORY FILTER BUTTONS
     ========================================================================== */
  function renderFilterBar() {
    const filterContainer = document.getElementById('portfolioFilterBar');
    if (!filterContainer) return;

    const categories = getResolvedCategories();
    filterContainer.innerHTML = '';

    categories.forEach(cat => {
      const filterId = (cat.id || '').toLowerCase().trim();
      const label = cat.name || (filterId === 'all' ? 'All' : filterId);
      const isActive = activeFilter === filterId;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-btn ${isActive ? 'active' : ''}`;
      btn.setAttribute('data-filter', filterId);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(isActive));
      btn.textContent = label;

      btn.addEventListener('click', () => {
        setFilter(filterId);
      });

      filterContainer.appendChild(btn);
    });
  }

  /* ==========================================================================
     8. FILTERING & SEARCH ENGINE
     ========================================================================== */
  function getFilteredDemos() {
    const categories = getResolvedCategories();
    const validCatIds = new Set(categories.map(c => (c.id || '').toLowerCase().trim()));

    // Fallback: If activeFilter is invalid, default to 'all'
    const currentFilter = validCatIds.has(activeFilter) ? activeFilter : 'all';

    return portfolioDemos.filter(demo => {
      // 1. Category Matching
      const demoCat = (demo.category || '').toLowerCase().trim();
      const matchesCategory = (currentFilter === 'all') || (demoCat === currentFilter);
      if (!matchesCategory) return false;

      // 2. Search Query Matching (name, description, category)
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      const name = String(demo.name || demo.title || '').toLowerCase();
      const desc = String(demo.description || '').toLowerCase();
      const catId = demoCat;
      const catName = getCategoryDisplayName(demo.category).toLowerCase();

      return name.includes(q) || desc.includes(q) || catId.includes(q) || catName.includes(q);
    });
  }

  /* ==========================================================================
     9. RENDER PORTFOLIO GRID & VIEW ALL BUTTON
     ========================================================================== */
  function renderPortfolio() {
    const gridContainer = document.getElementById('portfolioGrid');
    if (!gridContainer) return;

    const filtered = getFilteredDemos();
    const isHome = !isArchivePage;

    // Homepage limit: display up to the first 10 demo cards in All or category
    let displayedDemos = filtered;
    if (isHome && filtered.length > 10) {
      displayedDemos = filtered.slice(0, 10);
    }

    // Update search status text if on archive page
    renderSearchStatus(filtered.length, portfolioDemos.length);

    // Empty state
    if (displayedDemos.length === 0) {
      const isSearchActive = Boolean(searchQuery);
      gridContainer.innerHTML = `
        <div class="portfolio-empty" style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem;">
          <div class="empty-icon" style="width: 48px; height: 48px; margin: 0 auto 1rem; color: var(--color-primary);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-navy-900); margin-bottom: 0.5rem;">
            ${isSearchActive ? `No websites match "${escapeHtml(searchQuery)}"` : 'No demos found in this category'}
          </h3>
          <p style="color: var(--color-text-muted); margin-bottom: 1.25rem;">
            ${isSearchActive ? 'Try searching with different keywords or clear your search to view all projects.' : 'We are continuously building new live demos. Check back soon or view all projects.'}
          </p>
          <button type="button" class="btn btn-outline btn-sm" id="resetDemoFilterBtn">
            ${isSearchActive ? 'Clear Search' : 'View All Websites'}
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('resetDemoFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (isSearchActive) {
            clearSearch();
          } else {
            setFilter('all');
          }
        });
      }

      renderViewAllButton(0, isHome);
      return;
    }

    // Build cards HTML
    let html = '';
    displayedDemos.forEach((demo, index) => {
      const displayDomain = extractDisplayDomain(demo.liveUrl || demo.url);
      const iconSvg = getCategoryIcon(demo.category);
      const categoryDisplayName = getCategoryDisplayName(demo.category);
      const delayClass = `delay-${(index % 3) + 1}`;
      const safeId = escapeHtml(demo.id || `demo-${index}`);
      const safeName = escapeHtml(demo.name || demo.title || 'Live Website Demo');
      const safeCategory = escapeHtml(categoryDisplayName);
      const safeDesc = escapeHtml(demo.description || 'Production-grade web solution engineered by ALFAIZ Web Agency.');
      const safeLiveUrl = sanitizeUrl(demo.liveUrl || demo.url);
      const safeImage = escapeHtml(demo.image || demo.img || '');

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

    // View All button on homepage (Requirement 4)
    renderViewAllButton(filtered.length, isHome);

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
     10. HOMEPAGE "VIEW ALL DEMOS" BUTTON (Requirement 4)
     ========================================================================== */
  function renderViewAllButton(totalFilteredCount, isHome) {
    const wrap = document.getElementById('portfolioViewAllWrap');
    if (!wrap) return;

    // Only display on homepage when filtered demos exceed 10
    if (!isHome || totalFilteredCount <= 10) {
      wrap.innerHTML = '';
      return;
    }

    const targetUrl = activeFilter === 'all'
      ? 'demos.html'
      : `demos.html?category=${encodeURIComponent(activeFilter)}`;

    const label = activeFilter === 'all'
      ? 'View All Demos'
      : `View All ${getCategoryDisplayName(activeFilter)} Demos`;

    wrap.innerHTML = `
      <a href="${targetUrl}" class="btn btn-view-all reveal reveal-up" aria-label="${label}">
        <span>${escapeHtml(label)}</span>
        <span class="view-all-badge">${totalFilteredCount}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    `;

    if (window.portfolioRevealObserver) {
      wrap.querySelectorAll('.reveal').forEach(el => window.portfolioRevealObserver.observe(el));
    }
  }

  /* ==========================================================================
     11. SEARCH CONTROLS & STATUS (Requirement 5)
     ========================================================================== */
  function renderSearchStatus(visibleCount, totalCount) {
    const statusEl = document.getElementById('demoSearchStatus');
    const visibleEl = document.getElementById('demoVisibleCount');
    const totalEl = document.getElementById('demoTotalCount');

    if (visibleEl) visibleEl.textContent = visibleCount;
    if (totalEl) totalEl.textContent = totalCount;

    if (statusEl) {
      if (searchQuery) {
        statusEl.innerHTML = `Found <strong>${visibleCount}</strong> website${visibleCount === 1 ? '' : 's'} matching "<strong>${escapeHtml(searchQuery)}</strong>"`;
      } else if (activeFilter !== 'all') {
        statusEl.innerHTML = `Showing <strong>${visibleCount}</strong> ${escapeHtml(getCategoryDisplayName(activeFilter))} website${visibleCount === 1 ? '' : 's'}`;
      } else {
        statusEl.innerHTML = `Showing <strong>${visibleCount}</strong> of <strong>${totalCount}</strong> live websites`;
      }
    }
  }

  function setupSearch() {
    const searchInput = document.getElementById('demoSearchInput');
    const clearBtn = document.getElementById('demoSearchClear');
    if (!searchInput) return;

    if (searchQuery) {
      searchInput.value = searchQuery;
      if (clearBtn) clearBtn.style.display = 'flex';
    }

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = searchQuery ? 'flex' : 'none';
      }
      renderPortfolio();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        clearSearch();
      });
    }
  }

  function clearSearch() {
    const searchInput = document.getElementById('demoSearchInput');
    const clearBtn = document.getElementById('demoSearchClear');
    searchQuery = '';
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    if (clearBtn) {
      clearBtn.style.display = 'none';
    }
    renderPortfolio();
  }

  /* ==========================================================================
     12. INITIALIZATION
     ========================================================================== */
  function initPortfolio() {
    const filterContainer = document.getElementById('portfolioFilterBar');
    const gridContainer = document.getElementById('portfolioGrid');

    if (!filterContainer && !gridContainer) {
      return;
    }

    // Scroll reveal observer for dynamically created elements
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
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

    setupSearch();
    renderFilterBar();
    setFilter(activeFilter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }

  /* ==========================================================================
     13. GLOBAL API EXPORTS
     ========================================================================== */
  window.demoCategories = demoCategories;
  window.portfolioDemos = portfolioDemos;
  window.reloadPortfolioDemos = () => {
    renderFilterBar();
    renderPortfolio();
  };
  window.setDemoFilter = setFilter;
  window.setDemoSearch = (query) => {
    searchQuery = query ? String(query).trim() : '';
    const input = document.getElementById('demoSearchInput');
    const clearBtn = document.getElementById('demoSearchClear');
    if (input) input.value = searchQuery;
    if (clearBtn) clearBtn.style.display = searchQuery ? 'flex' : 'none';
    renderPortfolio();
  };

})();
