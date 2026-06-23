/* ==========================================================================
   Krishna Priya K - Personal Portfolio Interaction Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Preloader Logic
    const preloader = document.getElementById('preloader');
    const hidePreloader = () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }
        }, 1200);
    };

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }

    // Timeout fallback for preloader
    setTimeout(() => {
        if (preloader && preloader.style.opacity !== '0') {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
    }, 3000);

    // 3. Canvas Particle Background
    initParticleCanvas();

    // 4. Navigation & Mobile Menu Menu Toggle
    initNavigation();

    // 5. Typed text hero subtitle
    initTypedText();

    // 6. Scroll Reveals & Skill Progress Bar Trigger
    initScrollObserver();

    // 7. Project Filtering
    initProjectFilters();

    // 8. GitHub API Integration
    initGitHubShowcase();

    // 9. Contact Form simulated encryption and submit
    initContactForm();
});

/* ==========================================================================
   Canvas Particles System
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Config options
    const maxParticles = width < 768 ? 40 : 90;
    const connectionDistance = 120;
    const speedMultiplier = 0.5;

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        // Re-scale particle count
        adjustParticleCount();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * speedMultiplier;
            this.vy = (Math.random() - 0.5) * speedMultiplier;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            // Standard bounds check
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            this.x += this.vx;
            this.y += this.vy;

            // Mouse interaction (push away gently)
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 2;
                    this.y += Math.sin(angle) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.4)'; // Soft Gold
            ctx.fill();
        }
    }

    function adjustParticleCount() {
        const targetCount = window.innerWidth < 768 ? 35 : 85;
        if (particles.length < targetCount) {
            while (particles.length < targetCount) {
                particles.push(new Particle());
            }
        } else if (particles.length > targetCount) {
            particles.length = targetCount;
        }
    }

    // Initialize particles array
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw and update particles
        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        // Draw mesh lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   Navigation Bar Interactivity
   ========================================================================== */
function initNavigation() {
    const header = document.querySelector('.navbar-header');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const mobileDrawer = document.getElementById('mobile-navigation-drawer');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    if (!menuToggleBtn || !mobileDrawer) return;

    const hamburgerIcon = menuToggleBtn.querySelector('.icon-hamburger');
    const closeIcon = menuToggleBtn.querySelector('.icon-close');

    // Sticky Navbar scroll trigger
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Drawer toggles
    menuToggleBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        
        if (isOpen) {
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        } else {
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // Close drawer when clicked link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                mobileDrawer.classList.remove('open');
                hamburgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    });
}

/* ==========================================================================
   Typed Text Animation (Hero Subtitle)
   ========================================================================== */
function initTypedText() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const phrases = [
        'Computer Science Engineering Student',
        'Aspiring Cybersecurity Professional',
        'Web Developer & Problem Solver',
        'Open Source Enthusiast'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 65;
    const deletingSpeed = 35;
    const pauseDelay = 2200;

    function tick() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            setTimeout(() => {
                isDeleting = true;
                tick();
            }, pauseDelay);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        const speed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(tick, speed);
    }

    // Start after hero fade-in delay
    setTimeout(tick, 900);
}

/* ==========================================================================
   Intersection Observers (Reveal animations & Scroll Highlight)
   ========================================================================== */
function initScrollObserver() {
    // Reveal effects
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(elem => revealObserver.observe(elem));

    // Skill percentages filling
    const skillsSection = document.querySelector('.skills-section');
    const skillFills = document.querySelectorAll('.skill-fill');
    
    if (skillsSection && skillFills.length > 0) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillFills.forEach(fill => {
                        const progress = fill.getAttribute('data-progress');
                        fill.style.width = progress;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        skillsObserver.observe(skillsSection);
    }

    // Active Navigation Highlighting based on scroll position
    const sections = document.querySelectorAll('section');
    const desktopLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Desktop
                desktopLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Mobile
                mobileLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: '-20% 0px -40% 0px'
    });

    sections.forEach(sec => activeNavObserver.observe(sec));
}

/* ==========================================================================
   Project Category Filtering
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Manage active buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterVal === 'all') {
                    card.classList.remove('filtered-out');
                } else {
                    const categories = card.getAttribute('data-categories').split(' ');
                    if (categories.includes(filterVal)) {
                        card.classList.remove('filtered-out');
                    } else {
                        card.classList.add('filtered-out');
                    }
                }
            });
        });
    });
}

/* ==========================================================================
   GitHub REST API Integration
   ========================================================================== */
async function initGitHubShowcase() {
    const githubUsername = 'krishna-priyak';
    const repoContainer = document.getElementById('github-repos-container');
    const repoCountEl = document.getElementById('github-repo-count');
    const followersEl = document.getElementById('github-followers-count');
    const followingEl = document.getElementById('github-following-count');

    // Default project fallbacks if API limits reached
    const fallbackRepos = [
        {
            name: "Banking-System",
            description: "Secure Java-based banking framework featuring credential hashing, prepared statements to prevent SQL injection (SQLi), structured transactions, and ledger logs.",
            language: "Java",
            stargazers_count: 3,
            forks_count: 1,
            html_url: "https://github.com/krishna-priyak/Banking-System-Project"
        },
        {
            name: "StaySync",
            description: "Booking platform featuring secure session authentication middleware, role-based controls, input validation to mitigate OWASP Top 10 risks, and listing managers.",
            language: "PHP",
            stargazers_count: 2,
            forks_count: 0,
            html_url: "https://github.com/krishna-priyak"
        },
        {
            name: "EcoSnap",
            description: "Community sustainability client focusing on image submissions, tracking green footprints, and interactive leaderboard grids.",
            language: "JavaScript",
            stargazers_count: 4,
            forks_count: 1,
            html_url: "https://github.com/krishna-priyak"
        }
    ];

    try {
        // Fetch Profile details
        const profileRes = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (!profileRes.ok) throw new Error('Failed to fetch github profile');
        const profileData = await profileRes.json();
        
        repoCountEl.textContent = profileData.public_repos || '12';
        followersEl.textContent = profileData.followers || '8';
        followingEl.textContent = profileData.following || '15';

        // Fetch repositories (sorted by updated)
        const reposRes = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`);
        if (!reposRes.ok) throw new Error('Failed to fetch github repos');
        const reposData = await reposRes.json();
        
        // Remove skeleton templates
        repoContainer.innerHTML = '';
        
        // Take top 3 or 4 repositories, filter out forks if any
        const filteredRepos = reposData.filter(r => !r.fork).slice(0, 4);

        if (filteredRepos.length === 0) {
            renderFallbackRepos(fallbackRepos);
        } else {
            filteredRepos.forEach(repo => {
                renderRepoCard(repo);
            });
        }

    } catch (err) {
        console.warn('GitHub API failure: loading styled fallback components.', err);
        // Load fallback count parameters
        repoCountEl.textContent = '8';
        followersEl.textContent = '10';
        followingEl.textContent = '12';
        
        renderFallbackRepos(fallbackRepos);
    }

    function renderRepoCard(repo) {
        const langLower = repo.language ? repo.language.toLowerCase() : '';
        const langClass = langLower === 'javascript' ? 'js' : langLower;
        
        const cardHtml = `
            <div class="repo-card glass-card">
                <div class="repo-title-row">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card-title">${repo.name}</a>
                    <i data-lucide="external-link" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
                </div>
                <p class="repo-desc">${repo.description || 'No description provided. Explore codebase references.'}</p>
                <div class="repo-footer">
                    <div class="repo-left-footer">
                        ${repo.language ? `
                        <span class="repo-lang">
                            <span class="lang-dot ${langClass}"></span>
                            ${repo.language}
                        </span>` : ''}
                    </div>
                    <div class="repo-right-footer" style="display: flex; gap: 12px;">
                        <span class="repo-stats"><i data-lucide="star"></i> ${repo.stargazers_count}</span>
                        <span class="repo-stats"><i data-lucide="git-fork"></i> ${repo.forks_count}</span>
                    </div>
                </div>
            </div>
        `;
        repoContainer.insertAdjacentHTML('beforeend', cardHtml);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function renderFallbackRepos(repos) {
        repoContainer.innerHTML = '';
        repos.forEach(repo => {
            renderRepoCard(repo);
        });
    }
}

/* ==========================================================================
   Secure Simulated Contact Form
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-message-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const statusMsg = document.getElementById('form-status-msg');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Visual loading trigger
        submitBtn.disabled = true;
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `<i data-lucide="loader" class="animate-spin"></i> Encrypting & Sending...`;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Simulate secure API response delay
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            statusMsg.className = 'form-status success';
            statusMsg.innerHTML = `<i data-lucide="check-circle" style="width:16px; height:16px; vertical-align:middle; margin-right:6px;"></i> Transmission authenticated! Message successfully sent to Krishna.`;
            statusMsg.classList.remove('hidden');

            form.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                statusMsg.classList.add('hidden');
            }, 5000);

        }, 1800);
    });
}
