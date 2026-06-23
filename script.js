(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    
    let cx = 0, cy = 0;
    let targetCX = 0, targetCY = 0;

    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;
    let lastScrollDir = 1;

    // Ambient stars setup
    const stars = [];
    const STAR_COUNT = 80;
    
    // Space objects (Rockets and Asteroids)
    const spaceObjects = [];

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

    // Initialize stars (Upgraded with colors and flare capability)
    for (let i = 0; i < STAR_COUNT; i++) {
        const size = Math.random() * 1.8 + 0.5;
        const colors = ['#ffffff', '#a5f3fc', '#fde047'];
        const r = Math.random();
        const color = r < 0.7 ? colors[0] : (r < 0.9 ? colors[1] : colors[2]);
        stars.push({
            x: Math.random(),
            y: Math.random(),
            size: size,
            alpha: Math.random(),
            speed: 0.003 + Math.random() * 0.008,
            color: color,
            isFlare: size > 1.4 && Math.random() < 0.3
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
        
        // Scroll speed velocity calculation for Warp Speed Option
        const instantDelta = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        if (Math.abs(instantDelta) > 0.1) {
            lastScrollDir = instantDelta > 0 ? 1 : -1;
        }
        scrollSpeed += (Math.abs(instantDelta) - scrollSpeed) * 0.12;
        
        // Solar system fades out as page scrolls down
        const solarSystemOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.85));
        
        // Update mouse position smoothing
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Draw ambient stars (twinkling and scrolling parallax with lens flares)
        stars.forEach(star => {
            // Stars twinkle faster at warp speed
            const twinkleSpeedFactor = 1 + scrollSpeed * 0.08;
            star.alpha += star.speed * twinkleSpeedFactor;
            if (star.alpha > 1 || star.alpha < 0.15) {
                star.speed = -star.speed;
            }
            const sx = star.x * width;
            // Star parallax scroll with robust boundary wrapping
            const sy = ((star.y * height - scrollY * 0.12) % height + height) % height;
            
            ctx.globalAlpha = Math.max(0.12, star.alpha * 0.6);
            
            if (scrollSpeed > 1.5) {
                // Draw star as a stretched warp line
                const lineLength = star.size * Math.min(scrollSpeed * 0.35, 30);
                ctx.strokeStyle = star.color;
                ctx.lineWidth = star.size * 0.7;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                // Extend the line opposite to scroll direction (trailing line)
                ctx.lineTo(sx, sy + lastScrollDir * lineLength);
                ctx.stroke();
            } else {
                // Draw star as a twinkling circle
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw twinkling cross-flare for larger stars
                if (star.isFlare) {
                    ctx.strokeStyle = star.color;
                    ctx.lineWidth = 0.4;
                    ctx.beginPath();
                    ctx.moveTo(sx, sy - star.size * 3.5);
                    ctx.lineTo(sx, sy + star.size * 3.5);
                    ctx.moveTo(sx - star.size * 3.5, sy);
                    ctx.lineTo(sx + star.size * 3.5, sy);
                    ctx.stroke();
                }
            }
            ctx.globalAlpha = 1.0;
        });

        // Spawn Rockets and Asteroids at low frequency (active throughout all sections)
        if (Math.random() < 0.0035) { // Spawn a Rocket
            const side = Math.floor(Math.random() * 4);
            let x, y, vx, vy;
            const speed = 1.6 + Math.random() * 2.2;
            const angle = (Math.random() * 40 - 20) * (Math.PI / 180) + (side === 0 ? Math.PI/2 : (side === 1 ? Math.PI : (side === 2 ? -Math.PI/2 : 0)));
            
            if (side === 0) { // Top
                x = Math.random() * width; y = -30;
            } else if (side === 1) { // Right
                x = width + 30; y = Math.random() * height;
            } else if (side === 2) { // Bottom
                x = Math.random() * width; y = height + 30;
            } else { // Left
                x = -30; y = Math.random() * height;
            }
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            
            spaceObjects.push({
                type: 'rocket',
                x, y, vx, vy,
                size: 14 + Math.random() * 6,
                color: Math.random() < 0.5 ? '#ff4d4d' : '#00d9ff',
                trail: []
            });
        }
        
        if (Math.random() < 0.005) { // Spawn an Asteroid
            const side = Math.floor(Math.random() * 4);
            let x, y, vx, vy;
            const speed = 0.8 + Math.random() * 1.2;
            const angle = Math.random() * Math.PI * 2;
            
            if (side === 0) {
                x = Math.random() * width; y = -20;
                vx = Math.cos(angle) * speed; vy = Math.abs(Math.sin(angle)) * speed;
            } else if (side === 1) {
                x = width + 20; y = Math.random() * height;
                vx = -Math.abs(Math.cos(angle)) * speed; vy = Math.sin(angle) * speed;
            } else if (side === 2) {
                x = Math.random() * width; y = height + 20;
                vx = Math.cos(angle) * speed; vy = -Math.abs(Math.sin(angle)) * speed;
            } else {
                x = -20; y = Math.random() * height;
                vx = Math.abs(Math.cos(angle)) * speed; vy = Math.sin(angle) * speed;
            }
            
            const radius = 5 + Math.random() * 8;
            const numPoints = 5 + Math.floor(Math.random() * 4);
            const points = [];
            for (let i = 0; i < numPoints; i++) {
                const a = (i * Math.PI * 2) / numPoints;
                const r = radius * (0.75 + Math.random() * 0.5);
                points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
            }
            
            spaceObjects.push({
                type: 'asteroid',
                x, y, vx, vy,
                radius, points,
                angle: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.05,
                trail: []
            });
        }

        // Update and draw Rockets & Asteroids
        for (let i = spaceObjects.length - 1; i >= 0; i--) {
            const obj = spaceObjects[i];
            obj.x += obj.vx;
            obj.y += obj.vy;
            
            if (obj.x < -100 || obj.x > width + 100 || obj.y < -100 || obj.y > height + 100) {
                spaceObjects.splice(i, 1);
                continue;
            }
            
            if (obj.type === 'rocket') {
                const heading = Math.atan2(obj.vy, obj.vx);
                
                if (Math.random() < 0.6) {
                    obj.trail.push({
                        x: obj.x - Math.cos(heading) * (obj.size * 0.6),
                        y: obj.y - Math.sin(heading) * (obj.size * 0.6),
                        vx: -Math.cos(heading) * 0.8 + (Math.random() - 0.5) * 0.4,
                        vy: -Math.sin(heading) * 0.8 + (Math.random() - 0.5) * 0.4,
                        size: 3.5 + Math.random() * 3,
                        alpha: 1.0,
                        color: Math.random() < 0.4 ? '#ff5500' : (Math.random() < 0.7 ? '#ffaa00' : '#ffea00')
                    });
                }
                
                for (let pIdx = obj.trail.length - 1; pIdx >= 0; pIdx--) {
                    const p = obj.trail[pIdx];
                    p.x += p.vx; p.y += p.vy;
                    p.alpha -= 0.04;
                    p.size *= 0.95;
                    if (p.alpha <= 0 || p.size < 0.5) {
                        obj.trail.splice(pIdx, 1);
                        continue;
                    }
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.alpha;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1.0;
                
                ctx.save();
                ctx.translate(obj.x, obj.y);
                ctx.rotate(heading);
                
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(obj.size * 0.6, 0);
                ctx.quadraticCurveTo(obj.size * 0.2, obj.size * 0.25, -obj.size * 0.5, obj.size * 0.25);
                ctx.lineTo(-obj.size * 0.5, -obj.size * 0.25);
                ctx.quadraticCurveTo(obj.size * 0.2, -obj.size * 0.25, obj.size * 0.6, 0);
                ctx.fill();
                
                ctx.fillStyle = obj.color;
                ctx.beginPath();
                ctx.moveTo(obj.size * 0.6, 0);
                ctx.quadraticCurveTo(obj.size * 0.4, obj.size * 0.2, obj.size * 0.2, obj.size * 0.18);
                ctx.lineTo(obj.size * 0.2, -obj.size * 0.18);
                ctx.quadraticCurveTo(obj.size * 0.4, -obj.size * 0.2, obj.size * 0.6, 0);
                ctx.fill();
                
                ctx.fillStyle = obj.color;
                ctx.beginPath();
                ctx.moveTo(-obj.size * 0.25, obj.size * 0.25);
                ctx.lineTo(-obj.size * 0.55, obj.size * 0.5);
                ctx.lineTo(-obj.size * 0.5, obj.size * 0.25);
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(-obj.size * 0.25, -obj.size * 0.25);
                ctx.lineTo(-obj.size * 0.55, -obj.size * 0.5);
                ctx.lineTo(-obj.size * 0.5, -obj.size * 0.25);
                ctx.fill();
                
                ctx.fillStyle = '#111111';
                ctx.beginPath();
                ctx.arc(0, 0, obj.size * 0.12, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            } else if (obj.type === 'asteroid') {
                obj.angle += obj.rotSpeed;
                
                if (Math.random() < 0.4) {
                    obj.trail.push({
                        x: obj.x, y: obj.y,
                        vx: -obj.vx * 0.4 + (Math.random() - 0.5) * 0.3,
                        vy: -obj.vy * 0.4 + (Math.random() - 0.5) * 0.3,
                        size: 2.0 + Math.random() * 2,
                        alpha: 0.6
                    });
                }
                
                for (let pIdx = obj.trail.length - 1; pIdx >= 0; pIdx--) {
                    const p = obj.trail[pIdx];
                    p.x += p.vx; p.y += p.vy;
                    p.alpha -= 0.05;
                    if (p.alpha <= 0) {
                        obj.trail.splice(pIdx, 1);
                        continue;
                    }
                    ctx.fillStyle = `rgba(160, 160, 160, ${p.alpha})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.save();
                ctx.translate(obj.x, obj.y);
                ctx.rotate(obj.angle);
                
                ctx.beginPath();
                ctx.moveTo(obj.points[0].x, obj.points[0].y);
                for (let pIdx = 1; pIdx < obj.points.length; pIdx++) {
                    ctx.lineTo(obj.points[pIdx].x, obj.points[pIdx].y);
                }
                ctx.closePath();
                
                const astGrad = ctx.createRadialGradient(-obj.radius * 0.2, -obj.radius * 0.2, 0, 0, 0, obj.radius);
                astGrad.addColorStop(0, `rgba(80, 80, 85, 1.0)`);
                astGrad.addColorStop(1, `rgba(40, 40, 43, 1.0)`);
                ctx.fillStyle = astGrad;
                ctx.strokeStyle = `rgba(100, 100, 105, 0.8)`;
                ctx.lineWidth = 1;
                ctx.fill();
                ctx.stroke();
                
                ctx.restore();
            }
        }

        // Only draw solar system if it's visible in viewport
        if (solarSystemOpacity > 0) {
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
            sunGlow.addColorStop(0, `rgba(0, 217, 255, ${solarSystemOpacity * 0.25})`);
            sunGlow.addColorStop(1, 'rgba(0, 217, 255, 0)');
            ctx.fillStyle = sunGlow;
            ctx.beginPath();
            ctx.arc(cx, cy, 60, 0, Math.PI * 2);
            ctx.fill();

            // Inner core circle
            ctx.beginPath();
            ctx.arc(cx, cy, 26, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(15, 15, 15, ${solarSystemOpacity * 0.9})`;
            ctx.strokeStyle = `rgba(0, 217, 255, ${solarSystemOpacity})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0, 217, 255, 0.7)';
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0; // reset

            // Code symbol inside core
            ctx.fillStyle = `rgba(0, 217, 255, ${solarSystemOpacity})`;
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
            ctx.strokeStyle = `rgba(77, 166, 255, ${solarSystemOpacity * 0.35})`;
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
                ctx.strokeStyle = `rgba(0, 217, 255, ${solarSystemOpacity * 0.07})`;
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 10]);
                ctx.stroke();
                ctx.setLineDash([]); // reset

                // Draw faint gravity connection ray
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(px, py);
                ctx.strokeStyle = `rgba(0, 217, 255, ${solarSystemOpacity * 0.04})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();

                // Draw 3D atmosphere glow
                const atmGlow = ctx.createRadialGradient(px, py, planet.size * 0.8, px, py, planet.size * 1.8);
                atmGlow.addColorStop(0, hexToRgba(planet.color, solarSystemOpacity * 0.28));
                atmGlow.addColorStop(0.5, hexToRgba(planet.color, solarSystemOpacity * 0.08));
                atmGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = atmGlow;
                ctx.beginPath();
                ctx.arc(px, py, planet.size * 1.8, 0, Math.PI * 2);
                ctx.fill();

                // Compute 3D lighting highlights facing the sun (cx, cy)
                const dx = px - cx;
                const dy = py - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const ux = dist > 0 ? dx / dist : 0;
                const uy = dist > 0 ? dy / dist : 0;
                
                const gx = px - ux * planet.size * 0.35;
                const gy = py - uy * planet.size * 0.35;
                
                const planetGrad = ctx.createRadialGradient(
                    gx, gy, planet.size * 0.08,
                    px, py, planet.size
                );
                planetGrad.addColorStop(0, hexToRgba(planet.color, solarSystemOpacity));
                planetGrad.addColorStop(0.5, hexToRgba(planet.color, solarSystemOpacity * 0.55));
                planetGrad.addColorStop(1, `rgba(10, 10, 14, ${solarSystemOpacity * 0.98})`);
                
                // Draw planet body
                ctx.fillStyle = planetGrad;
                ctx.beginPath();
                ctx.arc(px, py, planet.size, 0, Math.PI * 2);
                ctx.shadowBlur = 14;
                ctx.shadowColor = planet.color;
                ctx.fill();
                ctx.shadowBlur = 0; // reset
                
                // Draw planetary rings for Saturn-like visual flair
                if (planet.name === 'React.js' || planet.name === 'Node.js' || planet.name === 'Python') {
                    ctx.save();
                    ctx.translate(px, py);
                    ctx.rotate(0.28);
                    ctx.scale(1.0, 0.28);
                    ctx.beginPath();
                    ctx.arc(0, 0, planet.size * 1.6, 0, Math.PI * 2);
                    ctx.strokeStyle = hexToRgba(planet.color, solarSystemOpacity * 0.35);
                    ctx.lineWidth = 1.8;
                    ctx.stroke();
                    ctx.restore();
                }

                // Draw planet label (Inter font)
                ctx.fillStyle = `rgba(255, 255, 255, ${solarSystemOpacity * 0.9})`;
                ctx.font = `bold ${planet.size * 0.65}px 'Inter', sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(planet.label, px, py);

                // Draw moons
                if (planet.moons) {
                    planet.moons.forEach(moon => {
                        const mx = px + moon.radius * Math.cos(moon.angle);
                        const my = py + moon.radius * Math.sin(moon.angle);

                        // Draw 3D lighting gradient for moon
                        const moonGrad = ctx.createRadialGradient(
                            mx - (mx - px) * 0.35, my - (my - py) * 0.35, moon.size * 0.08,
                            mx, my, moon.size
                        );
                        moonGrad.addColorStop(0, hexToRgba(moon.color, solarSystemOpacity));
                        moonGrad.addColorStop(1, `rgba(15, 15, 15, ${solarSystemOpacity * 0.96})`);

                        ctx.fillStyle = moonGrad;
                        ctx.beginPath();
                        ctx.arc(mx, my, moon.size, 0, Math.PI * 2);
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = moon.color;
                        ctx.fill();
                        ctx.shadowBlur = 0; // reset

                        // Draw moon text
                        ctx.fillStyle = `rgba(255, 255, 255, ${solarSystemOpacity * 0.8})`;
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
    const roles = ['Engineer', 'Innovator', 'Developer', 'Entrepreneur', 'Problem solver', 'Designer'];
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