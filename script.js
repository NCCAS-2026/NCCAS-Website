document.addEventListener('DOMContentLoaded', () => {
  initSiteIntro();
  initStarfield();
  initNavigation();
  initCelestialExplorer();
  initNewsSection();
  initEventsSection();
  initScrollEffects();
  initDynamicYear();
});

function initSiteIntro() {
  const intro = document.getElementById('site-intro');
  if (!intro) return;

  const introCanvas = document.getElementById('intro-canvas');
  const progressFill = document.getElementById('intro-progress-fill');
  const statusText = document.getElementById('intro-status-text');
  const skipBtn = document.getElementById('intro-skip-btn');

  let animId;
  let isFinished = false;

  if (introCanvas) {
    const ctx = introCanvas.getContext('2d');
    let w = (introCanvas.width = window.innerWidth);
    let h = (introCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      w = introCanvas.width = window.innerWidth;
      h = introCanvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        color: ['#69F0F0', '#9178FF', '#EACB91', '#FFFFFF'][Math.floor(Math.random() * 4)],
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    function renderIntroStars() {
      if (isFinished) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(renderIntroStars);
    }
    renderIntroStars();
  }

  const duration = 5000;
  const startTime = performance.now();

  const statuses = [
    { at: 0.15, text: 'CALIBRATING TELESCOPE ARRAYS...' },
    { at: 0.40, text: 'SCANNING NIGHT SKY...' },
    { at: 0.70, text: 'SYNCHRONIZING CELESTIAL TELEMETRY...' },
    { at: 0.90, text: 'OBSERVATORY READY. WELCOME TO NCCAS.' }
  ];

  function updateProgress(now) {
    if (isFinished) return;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    if (progressFill) {
      progressFill.style.width = `${progress * 100}%`;
    }

    if (statusText) {
      for (let i = statuses.length - 1; i >= 0; i--) {
        if (progress >= statuses[i].at) {
          if (statusText.textContent !== statuses[i].text) {
            statusText.textContent = statuses[i].text;
          }
          break;
        }
      }
    }

    if (progress < 1) {
      requestAnimationFrame(updateProgress);
    } else {
      setTimeout(hideIntro, 400);
    }
  }

  requestAnimationFrame(updateProgress);

  const hideIntro = () => {
    if (isFinished) return;
    isFinished = true;
    cancelAnimationFrame(animId);
    intro.classList.add('fade-out');
    setTimeout(() => {
      intro.remove();
    }, 1000);
  };

  skipBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    hideIntro();
  });

  intro.addEventListener('click', hideIntro);
}

function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let meteors = [];
  let animationFrameId;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.min(Math.floor((width * height) / 4500), 250);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: Math.random() * 3 + 1,
        color: getRandomStarColor()
      });
    }
  }

  function getRandomStarColor() {
    const colors = [
      '#FFFFFF',
      '#F5F7FF',
      '#69F0F0',
      '#65B8FF',
      '#EACB91',
      '#D8C4FF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createMeteor() {
    if (Math.random() < 0.015 && meteors.length < 2) {
      meteors.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.3,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.twinklePhase += s.twinkleSpeed;
      const currentAlpha = s.baseAlpha + Math.sin(s.twinklePhase) * 0.3;

      const px = s.x + (mouse.x * s.layer * 0.02);
      const py = s.y + (mouse.y * s.layer * 0.02);

      ctx.beginPath();
      ctx.arc(px, py, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
      ctx.fill();
    }

    createMeteor();
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      const endX = m.x - Math.cos(m.angle) * m.length;
      const endY = m.y - Math.sin(m.angle) * m.length;

      const grad = ctx.createLinearGradient(m.x, m.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
      grad.addColorStop(0.4, `rgba(105, 240, 240, ${m.alpha * 0.8})`);
      grad.addColorStop(1, 'rgba(105, 240, 240, 0)');

      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.alpha -= m.decay;

      if (m.alpha <= 0 || m.x > width || m.y > height) {
        meteors.splice(i, 1);
      }
    }

    ctx.globalAlpha = 1;
    animationFrameId = requestAnimationFrame(render);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 100);
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX - width / 2;
    mouse.targetY = e.clientY - height / 2;
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }
  });

  resize();
  render();
}

function initNavigation() {
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper?.classList.add('scrolled');
    } else {
      navbarWrapper?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      mobileDrawer.classList.toggle('open');
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -65% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));
}

const CELESTIAL_DATA = [
  {
    id: 'sun',
    name: 'The Sun',
    category: 'solar',
    categoryLabel: 'Star',
    image: 'assets/images/sun.jpg',
    tagline: 'The blazing gravitational anchor of our solar system',
    diameter: '1,392,700 km',
    distance: '149.9 Million km',
    orbitalPeriod: '~230 Million Yrs',
    temperature: '5,500°C (Surface)',
    atmosphere: 'Hydrogen (73%), Helium (25%)',
    summary: 'A G-type main-sequence star comprising 99.86% of the solar system\'s total mass, fueling planetary climates and space weather.',
    description: 'The Sun powers our solar system through thermonuclear fusion, fusing 600 million tons of hydrogen into helium every second in its core. Its dynamic magnetic field produces sunspots, solar flares, and coronal mass ejections that trigger spectacular auroral displays on Earth.',
    curiousFact: 'Light generated in the Sun’s core takes roughly 100,000 years to reach the surface due to dense radiative scattering, but only 8 minutes and 20 seconds to reach Earth.',
    observationTip: 'Never look directly at the Sun with the naked eye or an unshielded telescope. Always use certified solar projection or solar filters.'
  },
  {
    id: 'mercury',
    name: 'Mercury',
    category: 'solar',
    categoryLabel: 'Terrestrial Planet',
    image: 'assets/images/mercury.jpg',
    tagline: 'A swift, cratered world of extreme thermal swings',
    diameter: '4,879 km',
    distance: '57.9 Million km',
    orbitalPeriod: '88 Earth Days',
    temperature: '-180°C to 430°C',
    atmosphere: 'Trace exosphere (Na, O, H)',
    summary: 'The smallest planet and closest to the Sun, racing through space at 47 km/s with virtually no insulating atmosphere.',
    description: 'Despite being nearest to the Sun, Mercury is not the hottest planet — Venus holds that title. Mercury possesses a disproportionately large iron core occupying nearly 85% of its radius, causing the planet to contract as its interior cooled over geological time.',
    curiousFact: 'One solar day on Mercury (from sunrise to sunrise) lasts 176 Earth days, exactly twice as long as its year!',
    observationTip: 'Best observed during dusk or dawn twilight low along the horizon during its periods of maximum elongation from the Sun.'
  },
  {
    id: 'venus',
    name: 'Venus',
    category: 'solar',
    categoryLabel: 'Terrestrial Planet',
    image: 'assets/images/venus.jpg',
    tagline: 'The runaway greenhouse furnace shrouded in toxic sulfuric clouds',
    diameter: '12,104 km',
    distance: '108.2 Million km',
    orbitalPeriod: '225 Earth Days',
    temperature: '465°C (Hottest Planet)',
    atmosphere: '96.5% CO2, 3.5% N2',
    summary: 'Often referred to as Earth\'s twin in size, Venus underwent a catastrophic runaway greenhouse effect creating crushing surface pressures 92 times Earth\'s.',
    description: 'Venus spins backwards (retrograde rotation) compared to most solar system planets. Its thick cloud deck of sulfuric acid droplets reflects 75% of sunlight, making it the brightest planetary object in Sri Lanka\'s night sky.',
    curiousFact: 'Venus rotates so slowly that a single rotation on its axis (243 Earth days) takes longer than its entire orbital journey around the Sun (225 Earth days).',
    observationTip: 'Known as the "Morning Star" or "Evening Star", shining brilliantly with an apparent magnitude up to -4.9.'
  },
  {
    id: 'earth',
    name: 'Earth',
    category: 'solar',
    categoryLabel: 'Terrestrial Planet',
    image: 'assets/images/earth.jpg',
    tagline: 'Our vibrant cosmic sanctuary teeming with life and liquid water',
    diameter: '12,742 km',
    distance: '149.6 Million km (1 AU)',
    orbitalPeriod: '365.25 Days',
    temperature: '-89°C to 58°C (Avg 15°C)',
    atmosphere: '78% N2, 21% O2, 0.9% Ar',
    summary: 'The only celestial body currently known to harbor life, with liquid oceans, dynamic plate tectonics, and a protective magnetic shield.',
    description: 'Seen from deep space, Earth sparkles as a fragile "Pale Blue Dot". Its active magnetosphere shields surface biology from lethal cosmic rays and solar winds, while its balanced carbon cycle sustains a complex biosphere that has thrived for nearly four billion years.',
    curiousFact: 'Earth is an oblate spheroid; its centrifugal rotation causes it to bulge at the equator by approximately 43 km compared to its polar diameter.',
    observationTip: 'Look down to study our planetary crust, and look up through Anuradhapura\'s clear skies to celebrate our fragile cosmic atmosphere.'
  },
  {
    id: 'mars',
    name: 'Mars',
    category: 'solar',
    categoryLabel: 'Terrestrial Planet',
    image: 'assets/images/mars.jpg',
    tagline: 'The rusty crimson frontier of ancient river valleys and future explorers',
    diameter: '6,779 km',
    distance: '227.9 Million km',
    orbitalPeriod: '687 Earth Days',
    temperature: '-125°C to 20°C (Avg -60°C)',
    atmosphere: '95% CO2, 2.6% N2, 1.9% Ar',
    summary: 'Home to the largest volcano in the Solar System (Olympus Mons) and definitive evidence of ancient rivers and lakes.',
    description: 'Mars derives its iconic rusty red color from oxidized iron minerals covering its barren regolith. While currently a frigid desert under a thin atmosphere, robotic rovers like Perseverance have uncovered minerals that only form in long-standing liquid water.',
    curiousFact: 'Olympus Mons on Mars stands 21.9 km high — almost three times the height of Mount Everest above sea level.',
    observationTip: 'Appears as a brilliant reddish beacon during opposition; a small telescope can reveal its polar ice caps and major dark surface markings.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    category: 'solar',
    categoryLabel: 'Gas Giant',
    image: 'assets/images/jupiter.jpg',
    tagline: 'The colossal gas titan and gravitational guardian of the inner planets',
    diameter: '139,820 km',
    distance: '778.5 Million km',
    orbitalPeriod: '11.86 Earth Years',
    temperature: '-110°C (Cloud Tops)',
    atmosphere: '90% H2, 10% He',
    summary: 'More than twice as massive as all other solar system planets combined, commanding a miniature system of 95 known moons.',
    description: 'Jupiter acts as a gravitational shield for Earth by capturing and deflecting cometary debris. Its atmosphere features vivid counter-rotating jet streams and the famous Great Red Spot — an anticyclonic storm larger than Earth that has raged for centuries.',
    curiousFact: 'Ganymede, Jupiter\'s largest moon, is larger than the planet Mercury and is the only moon in the solar system known to have its own magnetic field.',
    observationTip: 'Even a modest 60mm refractor telescope will reveal Jupiter\'s atmospheric equatorial bands and the four Galilean moons (Io, Europa, Ganymede, Callisto).'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    category: 'solar',
    categoryLabel: 'Gas Giant',
    image: 'assets/images/hero-saturn.jpg',
    tagline: 'The crown jewel of the solar system adorned with magnificent icy rings',
    diameter: '116,460 km',
    distance: '1.43 Billion km',
    orbitalPeriod: '29.45 Earth Years',
    temperature: '-140°C (Cloud Tops)',
    atmosphere: '96% H2, 3% He',
    summary: 'The celestial muse of NCCAS, famed for its breathtaking ring system spanning 282,000 km while averaging merely 10 to 30 meters in thickness.',
    description: 'Saturn is the least dense planet in our solar system — less dense than liquid water. Its majestic rings consist of trillions of water-ice particles and rocky dust grains sculpted into crisp divisions by gravitational interactions with shepherd moons.',
    curiousFact: 'Saturn\'s moon Titan holds a thick nitrogen atmosphere with rivers and lakes of liquid methane, while icy Enceladus expels cryovolcanic plumes from a hidden subterranean ocean.',
    observationTip: 'Saturn\'s rings are instantly recognizable through any amateur astronomical telescope at 25x magnification or higher.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    category: 'solar',
    categoryLabel: 'Ice Giant',
    image: 'assets/images/uranus.jpg',
    tagline: 'The tilted cyan realm rolling on its side through deep space',
    diameter: '50,724 km',
    distance: '2.87 Billion km',
    orbitalPeriod: '84 Earth Years',
    temperature: '-224°C (Coldest Atmosphere)',
    atmosphere: '83% H2, 15% He, 2% CH4',
    summary: 'The first planet discovered using a telescope (William Herschel, 1781), rotating with an extreme axial tilt of 97.8 degrees.',
    description: 'Because Uranus literally rolls sideways along its orbital plane, each of its poles experiences 42 years of continuous sunlight followed by 42 years of total darkness. Atmospheric methane absorbs red light, giving the planet its serene aquamarine hue.',
    curiousFact: 'Uranus\'s moon Miranda features Verona Rupes, the tallest known cliff in the Solar System at 20 km high; a dropped object would take over 12 minutes to fall to the base!',
    observationTip: 'Appears as a faint greenish-blue star to the naked eye under exceptional dark skies, or clearly in 10x50 binoculars.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    category: 'solar',
    categoryLabel: 'Ice Giant',
    image: 'assets/images/neptune.jpg',
    tagline: 'The azure world of supersonic winds and icy geysers',
    diameter: '49,244 km',
    distance: '4.5 Billion km (30.1 AU)',
    orbitalPeriod: '164.8 Earth Years',
    temperature: '-218°C',
    atmosphere: '80% H2, 19% He, 1.5% CH4',
    summary: 'The most distant major planet in our solar system, discovered through mathematical prediction before direct optical observation.',
    description: 'Neptune is a dark, freezing world swept by supersonic winds that exceed 2,100 km/h — the fastest recorded anywhere in the Solar System. Its largest moon Triton orbits retrograde and spews liquid nitrogen geysers across icy plains.',
    curiousFact: 'Neptune completed its first full orbit since its 1846 discovery in 2011 — a journey spanning 165 Earth years.',
    observationTip: 'Requires a telescope of at least 8-inch aperture to resolve into a distinct tiny blue planetary disc.'
  },
  {
    id: 'galaxies',
    name: 'Galaxies',
    category: 'deep_sky',
    categoryLabel: 'Deep Space',
    image: 'assets/images/galaxy.jpg',
    tagline: 'Vast cosmic island universes containing hundreds of billions of suns',
    diameter: '10,000 to 1,000,000+ Light Yrs',
    distance: '2.5 Million LY (Andromeda)',
    orbitalPeriod: 'Galactic Rotational Epochs',
    temperature: 'Varies by stellar population',
    atmosphere: 'Interstellar Medium & Dark Matter',
    summary: 'Massive gravitationally bound systems composed of stars, stellar remnants, interstellar gas, cosmic dust, and mysterious dark matter.',
    description: 'From spiral galaxies like our own Milky Way to giant ellipticals and distorted irregulars, galaxies represent the grand building blocks of the observable universe. At the core of virtually every large galaxy lies a supermassive black hole.',
    curiousFact: 'When you view the Andromeda Galaxy (M31) from Sri Lanka with binoculars, the light striking your eyes began its journey 2.5 million years ago before modern humans walked the Earth.',
    observationTip: 'From dark-sky rural sites in Anuradhapura, the Andromeda Galaxy is readily visible as an elongated fuzzy oval in the northern autumn sky.'
  },
  {
    id: 'nebulae',
    name: 'Nebulae',
    category: 'deep_sky',
    categoryLabel: 'Deep Space',
    image: 'assets/images/nebula.jpg',
    tagline: 'Vast interstellar clouds of dust and gas where baby stars are born',
    diameter: 'Few to hundreds of Light Yrs',
    distance: '1,344 Light Yrs (Orion)',
    orbitalPeriod: 'Stellar Lifecycle Epochs',
    temperature: '10 K (Cold) to 10,000 K (Ionized)',
    atmosphere: 'Hydrogen, Helium & Ionized Gas',
    summary: 'Glowing stellar nurseries where gravitational collapse triggers the birth of new stars and planetary systems.',
    description: 'Nebulae are categorized as emission, reflection, dark, and planetary nebulae. Ultraviolet radiation from young massive stars ionizes surrounding hydrogen gas, causing it to glow with brilliant crimson, cyan, and violet emission lines.',
    curiousFact: 'The Pillars of Creation inside the Eagle Nebula are dense towers of gas and dust over four light-years tall — large enough to envelop entire solar systems.',
    observationTip: 'The Great Orion Nebula (M42) is easily visible to the naked eye as a hazy smudge in Orion’s sword, and reveals breathtaking ethereal wisps in binoculars.'
  },
  {
    id: 'black-holes',
    name: 'Black Holes',
    category: 'deep_sky',
    categoryLabel: 'Deep Space Phenomenon',
    image: 'assets/images/black-hole.jpg',
    tagline: 'Spacetime abysses of infinite curvature where not even light can escape',
    diameter: 'Varies (Schwarzschild Radius)',
    distance: '1,560 LY (Gaia BH1) to Billions LY',
    orbitalPeriod: 'Relativistic Singularity',
    temperature: 'Near Absolute Zero (Hawking Rad)',
    atmosphere: 'Singularity / Accretion Disk Plasma',
    summary: 'Regions of spacetime where gravitational acceleration is so intense that nothing can escape past its event horizon.',
    description: 'Formed when massive stars undergo gravitational collapse at the end of their thermonuclear lifetimes, or growing into supermassive monsters at galactic centers, black holes bend space and time to the absolute extremes predicted by Einstein’s general relativity.',
    curiousFact: 'At the event horizon of a black hole, gravitational time dilation is so severe that an outside observer would see an infalling object freeze in time and slowly fade.',
    observationTip: 'Black holes themselves cannot be seen directly, but their presence is revealed by the intense X-ray and radio emissions from superheated swirling accretion disks.'
  }
];

function initCelestialExplorer() {
  const grid = document.getElementById('celestial-grid');
  const tabs = document.querySelectorAll('.filter-tab');
  const modalOverlay = document.getElementById('celestial-modal');
  const modalBody = document.getElementById('celestial-modal-body');
  const closeBtn = document.getElementById('celestial-modal-close');

  if (!grid) return;

  function renderCards(filter = 'all') {
    grid.innerHTML = '';
    const filteredData = filter === 'all' 
      ? CELESTIAL_DATA 
      : CELESTIAL_DATA.filter(item => item.category === filter);

    filteredData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'glass-card celestial-card corner-accent';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Learn more about ${item.name}`);

      card.innerHTML = `
        <div class="celestial-image-wrapper">
          <img src="${item.image}" alt="${item.name}" class="celestial-card-img" loading="lazy">
          <span class="celestial-category-tag">${item.categoryLabel}</span>
        </div>
        <div class="celestial-body-info">
          <h3 class="celestial-name">${item.name}</h3>
          <p class="celestial-intro">${item.summary}</p>
          <div class="celestial-meta">
            <span class="meta-item">Diameter: <strong class="meta-value">${item.diameter}</strong></span>
            <span class="learn-more-link">
              Explore Data
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openModal(item));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(item);
        }
      });

      grid.appendChild(card);
    });
  }

  function openModal(item) {
    if (!modalOverlay || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-grid">
        <div class="modal-img-container">
          <img src="${item.image}" alt="${item.name}" class="modal-img">
        </div>
        <div class="modal-text-content">
          <span class="section-eyebrow" style="margin-bottom:0.75rem;">${item.categoryLabel}</span>
          <h2 class="section-title" style="font-size: 2rem; margin-bottom: 0.5rem;">${item.name}</h2>
          <p style="color: var(--aurora-cyan); font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 1.25rem;">${item.tagline}</p>
          <p class="about-card-text" style="margin-bottom: 1rem;">${item.description}</p>
          
          <div class="modal-stats-table">
            <div>
              <div class="stat-cell-label">Mean Diameter</div>
              <div class="stat-cell-val">${item.diameter}</div>
            </div>
            <div>
              <div class="stat-cell-label">Distance / Origin</div>
              <div class="stat-cell-val">${item.distance}</div>
            </div>
            <div>
              <div class="stat-cell-label">Orbital Period</div>
              <div class="stat-cell-val">${item.orbitalPeriod}</div>
            </div>
            <div>
              <div class="stat-cell-label">Surface Temperature</div>
              <div class="stat-cell-val">${item.temperature}</div>
            </div>
          </div>

          <div class="modal-fact-box">
            <div class="modal-fact-title">Astrophysical Insight</div>
            <div class="modal-fact-text">${item.curiousFact}</div>
          </div>

          <div class="modal-fact-box" style="border-left-color: var(--cosmic-gold); margin-top: 0.75rem;">
            <div class="modal-fact-title" style="color: var(--cosmic-gold);">Sri Lanka Sky Observation Tip</div>
            <div class="modal-fact-text">${item.observationTip}</div>
          </div>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeModal() {
    modalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
      closeModal();
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCards(tab.getAttribute('data-filter'));
    });
  });

  renderCards();
}

const NEWS_DATA = [
  {
    id: 'nccas-digital-platform',
    title: 'NCCAS Officially Unveils Its Next-Generation Digital Astronomy Platform',
    category: 'society',
    categoryLabel: 'Society Announcements',
    image: 'assets/images/observatory.jpg',
    date: 'October 15, 2026',
    source: 'NCCAS Media Bureau',
    url: 'https://whatsapp.com/channel/0029VbCPCSwHrDZbx76dog0m',
    summary: 'The Astronomy Society of A/Niwaththakachethiya National College introduces its digital observatory hub ahead of our upcoming student awareness symposium.',
    content: 'The Astronomy Society of A/Niwaththakachethiya National College (NCCAS) has officially unveiled its new interactive digital platform to provide students in Anuradhapura with unprecedented access to observational astronomy, planetary data, and space science initiatives. During the upcoming Student Awareness Meeting, college students will explore how they can engage in telescope observation camps, amateur astrophotography workshops, and global citizen-science asteroid detection campaigns.'
  },
  {
    id: 'jwst-exoplanet-atmospheres',
    title: 'James Webb Space Telescope Maps Chemical Fingerprints in Distant Exoplanet Atmospheres',
    category: 'discoveries',
    categoryLabel: 'Astronomy Discoveries',
    image: 'assets/images/jwst-news.jpg',
    date: 'October 08, 2026',
    source: 'NASA / ESA Science Operations',
    url: 'https://webbtelescope.org/news/news-releases',
    summary: 'Spectroscopic observations from JWST reveal distinct molecular signatures of methane, carbon dioxide, and water vapor across habitable-zone planetary candidates.',
    content: 'Using its ultra-sensitive Near-Infrared Spectrograph (NIRSpec), the James Webb Space Telescope continues to revolutionize exoplanetary science by obtaining detailed transmission spectra from alien worlds orbiting distant host stars. Recent data releases detail clear atmospheric absorption lines corresponding to water vapor (H2O), carbon dioxide (CO2), and sulfur dioxide (SO2), offering astronomers vital clues about photochemical processes taking place trillions of kilometers away.'
  },
  {
    id: 'artemis-lunar-architecture',
    title: 'Artemis Program Prepares for Next-Generation Human Deep Space Exploration',
    category: 'space-news',
    categoryLabel: 'Space News',
    image: 'assets/images/artemis-news.jpg',
    date: 'September 19, 2026',
    source: 'NASA Space Operations',
    url: 'https://www.nasa.gov/specials/artemis/',
    summary: 'International space agencies advance testing for the Space Launch System and Orion spacecraft to establish a permanent human scientific presence on the Moon.',
    content: 'NASA, together with its international partners ESA, JAXA, and CSA, is making continuous strides toward establishing sustainable lunar exploration infrastructure under the Artemis accord. Key developmental focus points include the Gateway lunar orbital space station and autonomous robotic rovers designed to prospect volatile water ice deposits trapped within permanently shadowed craters at the lunar South Pole.'
  },
  {
    id: 'sri-lanka-skywatching-guide',
    title: 'Equatorial Night Sky Guide: Planetary Conjunctions and Deep-Sky Wonders over Sri Lanka',
    category: 'skywatching',
    categoryLabel: 'Skywatching',
    image: 'assets/images/stargazing-news.jpg',
    date: 'September 28, 2026',
    source: 'Astronomical Society of Sri Lanka Reference',
    url: 'https://skyandtelescope.org/observing/sky-at-a-glance/',
    summary: 'Sri Lanka’s unique 8° north equatorial latitude grants stargazers an extraordinary panoramic view of both northern and southern celestial hemispheres.',
    content: 'Owing to its geographic proximity to the equator, observers in Anuradhapura and across Sri Lanka enjoy the rare privilege of seeing constellations from both celestial hemispheres throughout the annual cycle. Prime evening skies present Saturn shining prominently in the constellation Aquarius with its rings tilted favorably for amateur telescopes, followed by bright Jupiter rising with its quartet of Galilean moons.'
  },
  {
    id: 'citizen-science-asteroids',
    title: 'Citizen Science in Schools: How Students Detect Real Asteroids with Astrometrica',
    category: 'science-tech',
    categoryLabel: 'Science & Technology',
    image: 'assets/images/asteroid-news.jpg',
    date: 'August 30, 2026',
    source: 'IASC / Minor Planet Center',
    url: 'http://iasc.cosmosearch.org/',
    summary: 'High school students are discovering real near-Earth asteroids and main-belt objects using high-resolution astronomical survey data.',
    content: 'Through initiatives like the International Astronomical Search Collaboration (IASC), secondary students around the world examine genuine astronomical survey imagery captured by major research observatories such as Pan-STARRS in Hawaii. Using the specialized astrometric tool Astrometrica, student teams calibrate FITS image sets and track blinking moving targets against fixed background star fields, reporting potential discoveries directly to the Minor Planet Center.'
  }
];

function initNewsSection() {
  const newsGrid = document.getElementById('news-grid');
  const newsTabs = document.querySelectorAll('.news-filter-tab');

  if (!newsGrid) return;

  function renderNews(category = 'all') {
    newsGrid.innerHTML = '';
    const filteredNews = category === 'all'
      ? NEWS_DATA
      : NEWS_DATA.filter(n => n.category === category);

    if (filteredNews.length === 0) {
      newsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--glass-bg-card); border-radius: var(--radius-md); border: 1px dashed var(--glass-border);">
          <p style="color: var(--muted-silver);">No bulletins found in this category. Check back soon for updates!</p>
        </div>
      `;
      return;
    }

    filteredNews.forEach(article => {
      const card = document.createElement('article');
      card.className = 'glass-card news-card';

      card.innerHTML = `
        <div class="news-image-wrapper">
          <img src="${article.image}" alt="${article.title}" class="news-card-img" loading="lazy">
          <span class="news-category-badge">${article.categoryLabel}</span>
        </div>
        <div class="news-body">
          <div class="news-date-source">
            <span>${article.date}</span>
            <span>Source: ${article.source}</span>
          </div>
          <h3 class="news-headline">${article.title}</h3>
          <p class="news-summary">${article.summary}</p>
          <div class="news-footer">
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="learn-more-link">
              Read Official Source
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          </div>
        </div>
      `;

      newsGrid.appendChild(card);
    });
  }

  newsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      newsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderNews(tab.getAttribute('data-category'));
    });
  });

  renderNews();
}

const EVENTS_DATA = [
  {
    id: 'astro-night-campaign',
    title: 'Astro Night Campaign',
    category: 'Observation & Campaign',
    status: 'soon',
    statusLabel: 'Coming Soon',
    badgeClass: 'event-badge-soon',
    dateDisplay: 'Date and time will be announced soon',
    location: 'A/Niwaththakachethiya National College Premises',
    description: 'An immersive stargazing and telescope observation night featuring high power optical telescope viewing, planetary tracking, and guided constellation tours under Sri Lankan night skies.',
    highlights: [
      'High power optical telescope observations of the Moon and planets',
      'Laser guided night sky constellation navigation',
      'Interactive astronomy discussions with society mentors',
      'Open to all students official schedule to be announced soon'
    ],
    actionText: 'Get Announcement Alerts',
    actionUrl: 'https://whatsapp.com/channel/0029VbCPCSwHrDZbx76dog0m'
  }
];

function initEventsSection() {
  const eventsGrid = document.getElementById('events-grid');
  if (!eventsGrid) return;

  eventsGrid.innerHTML = '';
  EVENTS_DATA.forEach(event => {
    const card = document.createElement('div');
    card.className = 'glass-card event-card corner-accent';

    const highlightsList = event.highlights
      .map(h => `<li style="margin-left: 1rem; color: var(--muted-silver); font-size: 0.8125rem;">${h}</li>`)
      .join('');

    card.innerHTML = `
      <div class="event-header">
        <span class="event-badge ${event.badgeClass}">${event.statusLabel}</span>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${event.category}</span>
      </div>
      <h3 class="event-title">${event.title}</h3>
      <p class="event-description">${event.description}</p>
      
      <div class="event-meta-list">
        <div class="event-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>${event.dateDisplay}</span>
        </div>
        <div class="event-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${event.location}</span>
        </div>
      </div>

      <ul style="margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.35rem;">
        ${highlightsList}
      </ul>

      <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <a href="${event.actionUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%; font-size: 0.8125rem; padding: 0.65rem 1rem;">
          ${event.actionText}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    `;

    eventsGrid.appendChild(card);
  });
}

function initScrollEffects() {
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const revealElements = document.querySelectorAll('.glass-card, .section-header');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });
}

function initDynamicYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
