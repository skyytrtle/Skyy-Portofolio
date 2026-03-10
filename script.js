/* ══════════════════════════════════════════════
   SKYY // Portfolio — Scripts
   ══════════════════════════════════════════════ */

// ── DETECT TOUCH DEVICE ──────────────────────────────────────────────────────
const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// ── CUSTOM CURSOR (desktop only) ─────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

if (!isTouchDevice()) {
    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx - 4 + 'px';
        cursor.style.top  = my - 4 + 'px';
    });

    function animRing() {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animRing);
    }
    animRing();

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            ring.style.transform   = 'translate(-50%,-50%) scale(1.5)';
            ring.style.borderColor = 'rgba(0,255,136,0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            ring.style.transform   = 'translate(-50%,-50%) scale(1)';
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

// Close menu on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});

// ── MATRIX RAIN ──────────────────────────────────────────────────────────────
const canvas = document.getElementById('matrix-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars    = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ@#$%^&*(){}[]<>?/\\'.split('');
const fontSize = 13;
let cols, drops;

function initMatrix() {
    cols  = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
}
initMatrix();
window.addEventListener('resize', initMatrix);

function drawMatrix() {
    ctx.fillStyle   = 'rgba(14,20,32,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drops.forEach((y, i) => {
        const char      = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle   = y === 1 ? '#a0e8ff' : '#43e097';
        ctx.globalAlpha = Math.random() * 0.4 + 0.15;
        ctx.fillText(char, i * fontSize, y * fontSize);
        ctx.globalAlpha = 1;

        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(drawMatrix, 50);

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
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Observe skills section directly for skill bar animation
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                setTimeout(() => { fill.style.width = fill.dataset.width; }, 200);
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
        if (ci === line.length) {
            deleting = true;
            setTimeout(typeStep, 1800);
            return;
        }
    } else {
        tw.textContent = line.slice(0, --ci);
        if (ci === 0) {
            deleting = false;
            li = (li + 1) % lines.length;
            setTimeout(typeStep, 400);
            return;
        }
    }

    setTimeout(typeStep, deleting ? 40 : 80);
}
setTimeout(typeStep, 2000);

// ── ORBIT DOT ─────────────────────────────────────────────────────────────────
const dot = document.getElementById('orbitDot');
let angle = 0;

function orbitStep() {
    angle += 0.015;
    const r  = 148;
    const cx = 150, cy = 150;
    dot.style.left = (cx + r * Math.cos(angle)) + 'px';
    dot.style.top  = (cy + r * Math.sin(angle)) + 'px';
    requestAnimationFrame(orbitStep);
}
orbitStep();

// ── NAVBAR ACTIVE STATE ───────────────────────────────────────────────────────
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 130) {
            current = section.getAttribute('id');
        }
    });

    navLinkEls.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--green)';
        }
    });

    // Back to top button visibility
    backToTop.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

// ── BACK TO TOP ───────────────────────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── TOUCH: TAP RIPPLE ON CARDS ────────────────────────────────────────────────
if (isTouchDevice()) {
    document.querySelectorAll('.skill-card, .journey-card, .contact-item').forEach(card => {
        card.addEventListener('touchstart', function () {
            this.style.transition = 'border-color 0.1s, background 0.1s';
        }, { passive: true });

        card.addEventListener('touchend', function () {
            setTimeout(() => {
                this.style.transition = '';
            }, 300);
        }, { passive: true });
    });
}
