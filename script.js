// ============================================
// DEVELOPER SOLAR SYSTEM BACKGROUND
// ============================================
(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    
    // Core center position and ease variables
    let cx = 0, cy = 0;
    let targetCX = 0, targetCY = 0;

    // Ambient stars setup
    const stars = [];
    const STAR_COUNT = 80;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight; // Fixed viewport resolution
        
        // Reset base positions after resize
        const baseCenter = getBaseCenter();
        if (cx === 0 && cy === 0) {
            cx = targetCX = baseCenter.x;
            cy = targetCY = baseCenter.y;
        }
    }

    function getBaseCenter() {
        if (window.innerWidth > 1024) {
            return { x: window.innerWidth * 0.7, y: window.innerHeight * 0.5 };
        } else {
            return { x: window.innerWidth * 0.5, y: window.innerHeight * 0.35 };
        }
    }

    // Initialize stars
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: 0.005 + Math.random() * 0.01
        });
    }

    // Tech Stack Planets & Moons configuration
    const planets = [
        {
            name: 'JavaScript',
            label: 'JS',
            color: '#f7df1e',
            radius: 120,
            speed: 0.006,
            angle: Math.random() * Math.PI * 2,
            size: 15,
            moons: [
                { label: 'TS', color: '#3178c6', radius: 24, speed: 0.03, angle: Math.random() * Math.PI * 2, size: 7.5 }
            ]
        },
        {
            name: 'React.js',
            label: 'React',
            color: '#61dafb',
            radius: 190,
            speed: 0.004,
            angle: Math.random() * Math.PI * 2,
            size: 18,
            moons: [
                { label: 'Tw', color: '#38bdf8', radius: 26, speed: 0.022, angle: Math.random() * Math.PI * 2, size: 7.5 }
            ]
        },
        {
            name: 'Node.js',
            label: 'Node',
            color: '#339933',
            radius: 260,
            speed: 0.003,
            angle: Math.random() * Math.PI * 2,
            size: 16,
            moons: [
                { label: 'Ex', color: '#ffffff', radius: 24, speed: 0.026, angle: Math.random() * Math.PI * 2, size: 7.5 }
            ]
        },
        {
            name: 'Python',
            label: 'Py',
            color: '#3776ab',
            radius: 330,
            speed: 0.002,
            angle: Math.random() * Math.PI * 2,
            size: 16,
            moons: [
                { label: 'Pd', color: '#ff7c00', radius: 24, speed: 0.018, angle: Math.random() * Math.PI * 2, size: 7.5 }
            ]
        },
        {
            name: 'MongoDB',
            label: 'Mongo',
            color: '#47a248',
            radius: 400,
            speed: 0.0014,
            angle: Math.random() * Math.PI * 2,
            size: 18,
            moons: [
                { label: 'SQL', color: '#00758f', radius: 25, speed: 0.016, angle: Math.random() * Math.PI * 2, size: 7.5 }
            ]
        },
        {
            name: 'Git',
            label: 'Git',
            color: '#f05032',
            radius: 470,
            speed: 0.001,
            angle: Math.random() * Math.PI * 2,
            size: 15,
            moons: [
                { label: 'GH', color: '#ffffff', radius: 23, speed: 0.02, angle: Math.random() * Math.PI * 2, size: 7.5 }
            ]
        }
    ];

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const scrollY = window.scrollY;
        
        // Parallax and fade out as page scrolls down
        const opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.85));
        
        // Update mouse position smoothing
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Draw ambient stars (twinkling and scrolling parallax)
        stars.forEach(star => {
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0.1) {
                star.speed = -star.speed;
            }
            const sx = star.x * width;
            const sy = (star.y * height - scrollY * 0.12 + height) % height;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, star.alpha * 0.45)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Only draw solar system if it's visible in viewport
        if (opacity > 0) {
            const baseCenter = getBaseCenter();
            
            // Mouse drift influence
            const mouseOffsetX = (mouse.x - width / 2) * 0.06;
            const mouseOffsetY = (mouse.y - height / 2) * 0.06;

            // Target position incorporates base center, mouse offset, and scroll parallax
            targetCX = baseCenter.x + mouseOffsetX;
            targetCY = baseCenter.y + mouseOffsetY - scrollY * 0.35;

            // Smooth interpolation to center
            cx += (targetCX - cx) * 0.06;
            cy += (targetCY - cy) * 0.06;

            // 1. Draw central developer core (Sun)
            // Outer glow
            const sunGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 60);
            sunGlow.addColorStop(0, `rgba(0, 217, 255, ${opacity * 0.25})`);
            sunGlow.addColorStop(1, 'rgba(0, 217, 255, 0)');
            ctx.fillStyle = sunGlow;
            ctx.beginPath();
            ctx.arc(cx, cy, 60, 0, Math.PI * 2);
            ctx.fill();

            // Inner core circle
            ctx.beginPath();
            ctx.arc(cx, cy, 26, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(15, 15, 15, ${opacity * 0.9})`;
            ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0, 217, 255, 0.7)';
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0; // reset

            // Code symbol inside core
            ctx.fillStyle = `rgba(0, 217, 255, ${opacity})`;
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('</>', cx, cy);

            // Rotating tech ring
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(Date.now() * 0.0003);
            ctx.beginPath();
            ctx.arc(0, 0, 36, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(77, 166, 255, ${opacity * 0.35})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 8]);
            ctx.stroke();
            ctx.restore();

            // 2. Draw orbits, gravity rays, and planets
            planets.forEach(planet => {
                const angle = planet.angle;
                
                // Calculate planet position
                const px = cx + planet.radius * Math.cos(angle);
                const py = cy + planet.radius * Math.sin(angle);

                // Draw faint dashed orbit ring
                ctx.beginPath();
                ctx.arc(cx, cy, planet.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0, 217, 255, ${opacity * 0.07})`;
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 10]);
                ctx.stroke();
                ctx.setLineDash([]); // reset

                // Draw faint gravity connection ray
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(px, py);
                ctx.strokeStyle = `rgba(0, 217, 255, ${opacity * 0.04})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();

                // Draw planet body
                ctx.beginPath();
                ctx.arc(px, py, planet.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(15, 15, 15, ${opacity * 0.95})`;
                ctx.strokeStyle = hexToRgba(planet.color, opacity);
                ctx.lineWidth = 1.8;
                ctx.shadowBlur = 10;
                ctx.shadowColor = planet.color;
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0; // reset

                // Draw planet label (Inter font)
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
                ctx.font = `bold ${planet.size * 0.65}px 'Inter', sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(planet.label, px, py);

                // Draw moons
                if (planet.moons) {
                    planet.moons.forEach(moon => {
                        const mx = px + moon.radius * Math.cos(moon.angle);
                        const my = py + moon.radius * Math.sin(moon.angle);

                        // Draw moon body
                        ctx.beginPath();
                        ctx.arc(mx, my, moon.size, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(20, 20, 20, ${opacity * 0.95})`;
                        ctx.strokeStyle = hexToRgba(moon.color, opacity);
                        ctx.lineWidth = 1.2;
                        ctx.shadowBlur = 6;
                        ctx.shadowColor = moon.color;
                        ctx.fill();
                        ctx.stroke();
                        ctx.shadowBlur = 0; // reset

                        // Draw moon text
                        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
                        ctx.font = `500 ${moon.size * 0.75}px monospace`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(moon.label, mx, my);

                        // Orbit update
                        moon.angle += moon.speed;
                    });
                }

                // Orbit update
                planet.angle += planet.speed;
            });
        }

        requestAnimationFrame(animate);
    }

    function hexToRgba(hex, alpha) {
        let c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x' + c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
        }
        return `rgba(255,255,255,${alpha})`;
    }

    // Event listeners
    window.addEventListener('mousemove', e => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    window.addEventListener('resize', () => {
        resize();
    });

    window.addEventListener('load', () => {
        resize();
    });

    resize();
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