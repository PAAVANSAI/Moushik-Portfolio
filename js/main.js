/* ============================================
   SHAIK MOUSHIK - PORTFOLIO JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // ---- Page Loader ----
    const pageLoader = document.getElementById('pageLoader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.classList.add('loaded');
            // Start animations after loader
            startHeroAnimations();
        }, 1200);
    });

    // Fallback: hide loader after 3s even if load event is slow
    setTimeout(() => {
        if (!pageLoader.classList.contains('loaded')) {
            pageLoader.classList.add('loaded');
            startHeroAnimations();
        }
    }, 3000);

    // ============================================
    // CURSOR GLOW EFFECT
    // ============================================
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--particle-color').trim() || 'rgba(99, 102, 241, 0.3)';

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor.replace(/[\d.]+\)$/, this.opacity + ')');
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = particleColor.replace(/[\d.]+\)$/, opacity + ')');
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ============================================
    // NAVIGATION
    // ============================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const navHamburger = document.getElementById('navHamburger');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll handler for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navHamburger.addEventListener('click', () => {
        navHamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navHamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger skill bar animations
                const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                });
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    animatedElements.forEach(el => animObserver.observe(el));

    // ============================================
    // HERO ANIMATIONS
    // ============================================
    function startHeroAnimations() {
        // Trigger hero scroll animations immediately
        const heroAnimElements = document.querySelectorAll('#home .animate-on-scroll');
        heroAnimElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 150);
        });

        // Start typewriter
        initTypewriter();

        // Start counter animation
        initCounters();
    }

    // ---- Typewriter Effect ----
    const typewriterText = document.getElementById('typewriterText');
    const phrases = [
        'Full-Stack Developer',
        'ML Enthusiast',
        'Python Developer',
        'Cloud Engineer',
        'Problem Solver',
        'Fresh Graduate'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typewrite() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(typewrite, typeSpeed);
    }

    function initTypewriter() {
        setTimeout(typewrite, 500);
    }

    // ---- Counter Animation ----
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 30);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 30);
                } else {
                    counter.textContent = target;
                }
            };

            setTimeout(updateCounter, 800);
        });
    }

    // ============================================
    // THEME SWITCHER
    // ============================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themePanel = document.getElementById('themePanel');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Toggle theme panel
    themeToggleBtn.addEventListener('click', () => {
        themePanel.classList.toggle('open');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-switcher')) {
            themePanel.classList.remove('open');
        }
    });

    // Apply theme
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);

            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            // Update particle color
            setTimeout(() => {
                particleColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--particle-color').trim();
            }, 100);

            // Close panel
            themePanel.classList.remove('open');

            // Add a transition flash effect
            const flash = document.createElement('div');
            flash.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: var(--accent-primary); opacity: 0.08; z-index: 9999;
                pointer-events: none; transition: opacity 0.5s ease;
            `;
            document.body.appendChild(flash);
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => flash.remove(), 500);
            }, 50);
        });
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeOptions.forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-theme') === savedTheme) {
                opt.classList.add('active');
            }
        });
        setTimeout(() => {
            particleColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--particle-color').trim();
        }, 100);
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // CONTACT FORM
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const formSubmitBtn = document.getElementById('formSubmitBtn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const subject = document.getElementById('formSubject').value;
        const message = document.getElementById('formMessage').value;

        // Simulate form submission
        formSubmitBtn.innerHTML = '<span class="btn-loading">Sending...</span>';
        formSubmitBtn.disabled = true;

        setTimeout(() => {
            // Build mailto link as fallback
            const mailtoLink = `mailto:itsmoushikshaik@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

            formSubmitBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Message Sent!
            `;
            formSubmitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

            // Open mailto
            window.location.href = mailtoLink;

            setTimeout(() => {
                formSubmitBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    Send Message
                `;
                formSubmitBtn.style.background = '';
                formSubmitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        }, 1500);
    });

    // ============================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // TILT EFFECT ON PROJECT CARDS
    // ============================================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ============================================
    // SCROLL INDICATOR HIDE ON SCROLL
    // ============================================
    const scrollIndicator = document.getElementById('scrollIndicator');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
        }
    });

    // ============================================
    // MAGNETIC EFFECT ON BUTTONS
    // ============================================
    const magneticBtns = document.querySelectorAll('.btn, .social-link');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform += ` translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ============================================
    // PARALLAX EFFECT ON HERO
    // ============================================
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');

        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
            heroContent.style.opacity = 1 - scrollY / 700;
        }
        if (heroVisual && scrollY < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrollY * 0.08}px)`;
            heroVisual.style.opacity = 1 - scrollY / 700;
        }
    });
});
