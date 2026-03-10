/* ══════════════════════════════════════════════
   SKYY // Portfolio — Scripts (Performance Optimized)
   ══════════════════════════════════════════════ */

// ── DETECT TOUCH / LOW-END DEVICE ────────────────────────────────────────────
const isTouch  = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const isMobile = window.innerWidth <= 640;

// ── CUSTOM CURSOR (desktop only) ─────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');

if (!isTouch) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        // Use transform instead of left/top to avoid layout reflow
        cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    }, { passive: true });

    // Reset cursor initial position style
    cursor.style.left = '0';
    cursor.style.top  = '0';

    function animRing() {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
        requestAnimationFrame(animRing);
    }
    // Override default transform on ring
    ring.style.transform = 'translate(-9999px, -9999px)';
    animRing();

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.scale   = '2';
            ring.style.scale     = '1.5';
            ring.style.borderColor = 'rgba(0,255,136,0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.scale   = '1';
            ring.style.scale     = '1';
            ring.style.borderColor = 'rgba(0,255,136,0.5)';
        });
    });
}

// ── HAMBURGER MENU ───────────────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    navOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});

// ── MATRIX RAIN (performance-aware) ──────────────────────────────────────────
const canvas = document.getElementById('matrix-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resizeCanvas(); initMatrix(); }, 200);
}, { passive: true });

const chars    = '01アカキクコサシスセタチナニ@#$%<>?'.split(''); // Reduced charset
const fontSize = isMobile ? 16 : 13; // Fewer columns on mobile (larger font = fewer cols)
const interval = isMobile ? 100 : 50; // Half the frame rate on mobile
let cols, drops;

function initMatrix() {
    // On mobile, only render every 2nd column to cut workload in half
    const density = isMobile ? 2 : 1;
    cols  = Math.floor(canvas.width / (fontSize * density));
    drops = Array(cols).fill(1);
}
initMatrix();

function drawMatrix() {
    ctx.fillStyle = 'rgba(14,20,32,0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px monospace`;

    const density = isMobile ? 2 : 1;
    drops.forEach((y, i) => {
        const char      = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle   = y === 1 ? '#a0e8ff' : '#43e097';
        ctx.globalAlpha = Math.random() * 0.35 + 0.1;
        ctx.fillText(char, i * fontSize * density, y * fontSize);
        ctx.globalAlpha = 1;
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(drawMatrix, interval);

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                fill.style.width = fill.dataset.width;
            });
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Skill bars trigger
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                setTimeout(() => { fill.style.width = fill.dataset.width; }, 150);
            });
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('#skills').forEach(el => skillObs.observe(el));

// ── TYPEWRITER ────────────────────────────────────────────────────────────────
const tw    = document.getElementById('typewriter');
const lines = ['ls skills/', 'python exploit.py', 'nmap -sV target', 'chmod +x future.sh'];
let li = 0, ci = 0, deleting = false;

function typeStep() {
    const line = lines[li];
    if (!deleting) {
        tw.textContent = line.slice(0, ++ci);
        if (ci === line.length) { deleting = true; setTimeout(typeStep, 1800); return; }
    } else {
        tw.textContent = line.slice(0, --ci);
        if (ci === 0) { deleting = false; li = (li + 1) % lines.length; setTimeout(typeStep, 400); return; }
    }
    setTimeout(typeStep, deleting ? 45 : 85);
}
setTimeout(typeStep, 1500);

// ── ORBIT DOT (skip rAF on mobile, use CSS animation instead) ────────────────
const dot = document.getElementById('orbitDot');

if (!isMobile) {
    let angle = 0;
    function orbitStep() {
        angle += 0.015;
        dot.style.left = (150 + 148 * Math.cos(angle)) + 'px';
        dot.style.top  = (150 + 148 * Math.sin(angle)) + 'px';
        requestAnimationFrame(orbitStep);
    }
    orbitStep();
} else {
    // CSS-driven orbit on mobile — zero JS cost
    dot.classList.add('orbit-css');
}

// ── NAVBAR ACTIVE STATE (throttled) ───────────────────────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');
const backToTop  = document.getElementById('backToTop');
let ticking      = false;

function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
        let current = '';
        const y = window.scrollY;

        sections.forEach(s => {
            if (y >= s.offsetTop - 140) current = s.id;
        });

        navLinkEls.forEach(link => {
            link.style.color = link.getAttribute('href') === '#' + current ? 'var(--green)' : '';
        });

        backToTop.classList.toggle('show', y > 400);
        ticking = false;
    });
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── BACK TO TOP ───────────────────────────────────────────────────────────────
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
