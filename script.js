// ============================================
// FLOWING PARTICLE BACKGROUND
// ============================================
(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles, mouse;
    const PARTICLE_COUNT = 90;
    const CONNECTION_DIST = 140;
    const MOUSE_RADIUS = 180;

    mouse = { x: -9999, y: -9999 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = document.documentElement.scrollHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(77, 166, 255, ${p.opacity})`;
        ctx.fill();
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 217, 255, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function update() {
        const scrollY = window.scrollY;
        particles.forEach(p => {
            // Gentle drift
            p.x += p.vx;
            p.y += p.vy;

            // Mouse repulsion (relative to scroll)
            const mx = mouse.x;
            const my = mouse.y + scrollY;
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }

            // Speed dampening for smooth flow
            p.vx *= 0.995;
            p.vy *= 0.995;

            // Wrap around edges
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        update();
        drawConnections();
        particles.forEach(drawParticle);
        requestAnimationFrame(animate);
    }

    // Track mouse
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Resize canvas when window or page height changes
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    // Recalculate canvas height after all images load
    window.addEventListener('load', () => {
        resize();
        createParticles();
    });

    resize();
    createParticles();
    animate();
})();
// ============================================
// ROLE TEXT TYPING ROTATION
// ============================================
(function () {
    const roles = ['Developer', 'Engineer', 'Student'];
    const roleEl = document.getElementById('roleText');
    const articleEl = document.getElementById('roleArticle');
    if (!roleEl || !articleEl) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const TYPE_SPEED = 100;
    const DELETE_SPEED = 60;
    const PAUSE_AFTER_TYPE = 2000;
    const PAUSE_AFTER_DELETE = 400;

    function getArticle(word) {
        return 'aeiouAEIOU'.includes(word[0]) ? 'an' : 'a';
    }

    function tick() {
        const currentRole = roles[roleIndex];

        if (!isDeleting) {
            charIndex++;
            roleEl.textContent = currentRole.substring(0, charIndex);
            articleEl.textContent = getArticle(currentRole);

            if (charIndex === currentRole.length) {
                setTimeout(() => { isDeleting = true; tick(); }, PAUSE_AFTER_TYPE);
                return;
            }
            setTimeout(tick, TYPE_SPEED);
        } else {
            charIndex--;
            roleEl.textContent = currentRole.substring(0, charIndex);

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                articleEl.textContent = getArticle(roles[roleIndex]);
                setTimeout(tick, PAUSE_AFTER_DELETE);
                return;
            }
            setTimeout(tick, DELETE_SPEED);
        }
    }

    setTimeout(tick, 1500);
})();

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = window.scrollY;
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// SCROLL-TRIGGERED FADE-IN ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// ============================================
// STAGGERED CARD ANIMATIONS
// ============================================
function staggerCards(selector, delay = 0.12) {
    document.querySelectorAll(selector).forEach((card, index) => {
        card.style.transitionDelay = `${index * delay}s`;
    });
}

staggerCards('.tech-icon-card', 0.04);
staggerCards('.project-card', 0.15);
staggerCards('.cert-card', 0.15);
staggerCards('.stat-item', 0.1);

// ============================================
// ANIMATED STAT COUNTERS
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10);
                if (target && !el.dataset.animated) {
                    el.dataset.animated = 'true';
                    animateCounter(el, target);
                }
            });
        }
    });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
    statsObserver.observe(statsBar);
}

// ============================================
// ACTIVE NAV LINK HIGHLIGHT
// ============================================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function highlightNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            navItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);
highlightNav();