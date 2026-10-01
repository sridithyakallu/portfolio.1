// ===== REMOVE WHITE BACKGROUND FROM STICKERS =====
function removeWhiteBackground(img) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const threshold = 230;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            if (r > threshold && g > threshold && b > threshold) {
                data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        img.src = canvas.toDataURL('image/png');
    } catch (e) {
        // Fallback for file:// protocol — use CSS blend mode
        img.style.mixBlendMode = 'multiply';
    }
}

document.querySelectorAll('.sticker').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
        removeWhiteBackground(img);
    } else {
        img.addEventListener('load', () => removeWhiteBackground(img));
    }
});


// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 120);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 80) {
        navbar.style.boxShadow = '0 4px 20px rgba(91, 77, 199, 0.12)';
        navbar.style.background = 'rgba(250, 248, 255, 0.95)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'var(--cream)';
    }

    lastScroll = currentScroll;
});

// ===== MOBILE HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PARALLAX CLOUDS ON MOUSE MOVE =====
const hero = document.getElementById('hero');
const clouds = document.querySelectorAll('.cloud');

hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    clouds.forEach((cloud, i) => {
        const speed = (i + 1) * 0.015;
        const x = (clientX - centerX) * speed;
        const y = (clientY - centerY) * speed;
        cloud.style.transform = `translate(${x}px, ${y}px)`;
    });
});

hero.addEventListener('mouseleave', () => {
    clouds.forEach(cloud => {
        cloud.style.transform = 'translate(0, 0)';
        cloud.style.transition = 'transform 0.5s ease';
    });
});

hero.addEventListener('mouseenter', () => {
    clouds.forEach(cloud => {
        cloud.style.transition = 'none';
    });
});
