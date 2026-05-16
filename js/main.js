/* ==========================================================
   SAKSHI HON PORTFOLIO — main.js
   Handles: Cursor, Sidebar, Page Transitions, IntersectionObserver,
            Particle Canvas, Typewriter, Count-up, Tilt, Magnetic,
            Filter Tabs, Card Flips, Form Submit, Easter Egg
   ========================================================== */

(() => {
  'use strict';

  // ── Console Easter Egg ──────────────────────────────────
  console.log(`%c
  ╔═══════════════════════════════════════╗
  ║                                       ║
  ║   ✦  Sakshi Santosh Hon  ✦            ║
  ║   Data Engineer · ML Engineer         ║
  ║   Software Developer · Researcher     ║
  ║                                       ║
  ║   Built with ♥ and lots of caffeine   ║
  ╚═══════════════════════════════════════╝
  `, 'color: #64ffda; font-family: monospace; font-size: 12px;');

  // ── Custom Cursor (desktop / mouse only) ────────────────
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring && !isTouchDevice) {
    let ringX = 0, ringY = 0, dotX = 0, dotY = 0;
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dotX = mouseX; dotY = mouseY;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';
    });

    const ringAnimate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(ringAnimate);
    };
    ringAnimate();

    const hoverEls = document.querySelectorAll('a, button, .btn, .filter-tab, .project-card, .cert-card, .resume-card, .nav-link, .mobile-nav-link, .contact-social-btn');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ── Sidebar ──────────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Hamburger ────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      drawer.classList.toggle('open');
    });
    drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
      });
    });
  }

  // ── Page Transitions ─────────────────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pageContent = document.querySelector('.page-content');

  if (pageContent && !prefersReduced) {
    pageContent.classList.add('flip-in');
    pageContent.addEventListener('animationend', () => pageContent.classList.remove('flip-in'), { once: true });
  }

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.endsWith('.pdf')) return;
    const validPages = ['index.html','about.html','projects.html','skills.html','certifications.html','resume.html','contact.html'];
    const target = href.split('/').pop();
    if (!validPages.includes(target) && target !== '') return;

    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      if (!pageContent || prefersReduced) { window.location.href = href; return; }
      pageContent.classList.add('flip-out');
      pageContent.addEventListener('animationend', () => { window.location.href = href; }, { once: true });
    });
  });

  // ── IntersectionObserver ─────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.dataset.delay) {
          entry.target.style.transitionDelay = entry.target.dataset.delay;
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Skill Pills Stagger ──────────────────────────────────
  const pillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pills = entry.target.querySelectorAll('.skill-pill');
        pills.forEach((pill, i) => {
          setTimeout(() => pill.classList.add('visible'), i * 60);
        });
        pillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.skill-pills').forEach(g => pillObserver.observe(g));

  // ── Cert Cards Stagger ───────────────────────────────────
  const certObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = document.querySelectorAll('.cert-card');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 120);
        });
        certObserver.disconnect();
      }
    });
  }, { threshold: 0.05 });
  const certsGrid = document.querySelector('.certs-grid');
  if (certsGrid) certObserver.observe(certsGrid);

  // ── Resume Cards Stagger ─────────────────────────────────
  const resumeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = document.querySelectorAll('.resume-card');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 160);
        });
        resumeObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });
  const resumeSection = document.querySelector('.resume-cards');
  if (resumeSection) resumeObserver.observe(resumeSection);

  // ── Count-up Animation ───────────────────────────────────
  const countEls = document.querySelectorAll('.stat-number[data-target]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isFloat = el.dataset.target.includes('.');
      const suffix = el.dataset.suffix || '';
      const duration = 1500;
      const startTime = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = (isFloat ? current.toFixed(2) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => countObserver.observe(el));

  // ── Typewriter ───────────────────────────────────────────
  const typeTarget = document.getElementById('typewriter-text');
  if (typeTarget) {
    const roles = ['ML Engineer', 'Full-Stack Developer', 'Researcher'];
    let roleIdx = 0, charIdx = 0, deleting = false;
    const type = () => {
      const role = roles[roleIdx];
      if (deleting) {
        typeTarget.textContent = role.substring(0, charIdx--);
        if (charIdx < 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(type, 400); return; }
        setTimeout(type, 60);
      } else {
        typeTarget.textContent = role.substring(0, charIdx++);
        if (charIdx > role.length) { deleting = true; setTimeout(type, 1800); return; }
        setTimeout(type, 100);
      }
    };
    setTimeout(type, 1200);
  }

  // ── Particle Canvas ──────────────────────────────────────
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const colors = ['rgba(100,255,218,', 'rgba(204,214,246,', 'rgba(100,180,255,'];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.35 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        this.pulse += 0.02;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        const a = this.alpha + Math.sin(this.pulse) * 0.08;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.max(0, Math.min(1, a)) + ')';
        ctx.fill();
      }
    }

    // Create particles & connections
    for (let i = 0; i < 80; i++) particles.push(new Particle());

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100,255,218,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // ── Card Tilt Effect ─────────────────────────────────────
  document.querySelectorAll('.card, .resume-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = -(y / rect.height) * 8;
      const tiltY = (x / rect.width) * 8;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Magnetic Button Effect ───────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // ── Project Filter Tabs ──────────────────────────────────
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ── Project Card Flip ────────────────────────────────────
  document.querySelectorAll('.project-hover-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      if (card) card.classList.add('flipped');
    });
  });
  document.querySelectorAll('.back-close').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      if (card) card.classList.remove('flipped');
    });
  });

  // ── Contact Form (Formspree) ────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const formWrap = document.getElementById('form-wrap');
      const successOverlay = document.getElementById('success-overlay');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // Show loading state
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      const data = {
        name:    contactForm.querySelector('#cf-name')?.value,
        email:   contactForm.querySelector('#cf-email')?.value,
        subject: contactForm.querySelector('#cf-subject')?.value,
        message: contactForm.querySelector('#cf-message')?.value,
      };

      try {
        const res = await fetch('https://formspree.io/f/xpqooowe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          if (formWrap && successOverlay) {
            formWrap.style.display = 'none';
            successOverlay.classList.add('show');
            setTimeout(() => {
              successOverlay.classList.remove('show');
              formWrap.style.display = '';
              contactForm.reset();
            }, 3500);
          }
        } else {
          const json = await res.json();
          alert('Oops! ' + (json?.errors?.[0]?.message || 'Something went wrong. Please try again.'));
          if (submitBtn) { submitBtn.textContent = 'Send Message'; submitBtn.disabled = false; }
        }
      } catch (err) {
        alert('Network error. Please check your connection and try again.');
        if (submitBtn) { submitBtn.textContent = 'Send Message'; submitBtn.disabled = false; }
      }
    });
  }

  // ── Chart.js Radar Chart ─────────────────────────────────
  const radarCanvas = document.getElementById('radar-chart');
  if (radarCanvas && window.Chart) {
    new window.Chart(radarCanvas, {
      type: 'radar',
      data: {
        labels: ['Data Engineering', 'AI / ML', 'Web Dev', 'Cloud & DBs', 'Tools & Langs'],
        datasets: [{
          label: 'Proficiency',
          data: [90, 88, 82, 78, 85],
          backgroundColor: 'rgba(100, 255, 218, 0.12)',
          borderColor: '#64ffda',
          pointBackgroundColor: '#64ffda',
          pointBorderColor: '#0a192f',
          pointHoverBackgroundColor: '#0a192f',
          pointHoverBorderColor: '#64ffda',
          borderWidth: 2,
          pointRadius: 5,
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true, min: 0, max: 100,
            ticks: { display: false },
            grid: { color: 'rgba(100,255,218,0.1)' },
            angleLines: { color: 'rgba(100,255,218,0.1)' },
            pointLabels: {
              color: '#8892b0',
              font: { family: "'Fira Code', monospace", size: 11 }
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#112240',
            titleColor: '#64ffda',
            bodyColor: '#ccd6f6',
            borderColor: 'rgba(100,255,218,0.2)',
            borderWidth: 1,
            callbacks: {
              label: ctx => ` ${ctx.raw}%`
            }
          }
        }
      }
    });
  }

})();
