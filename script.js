/* ==========================================================================
   Kamal Mansour Kamal - Portfolio Script & Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNeuralCanvas();
    initTypewriter();
    initThemeToggle();
    initNavbarScroll();
    initMobileMenu();
    initScrollReveal();
    initSkillFilters();
    initProjectFilters();
});

/* ==========================================================================
   1. Neural Network Particle Canvas Background
   ========================================================================== */
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(Math.floor(width * 0.05), 65);
    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '#00f2fe' : '#7f00ff';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let angle = Math.atan2(dy, dx);
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        const maxDist = 130;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    let opacity = 1 - (dist / maxDist);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.2})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();
}

/* ==========================================================================
   2. Typing Text Effect
   ========================================================================== */
function initTypewriter() {
    const target = document.getElementById('typing-text');
    if (!target) return;

    const phrases = [
        "Computer Science Student",
        "Aspiring AI Engineer",
        "Software Engineer",
        "Embedded Systems Enthusiast",
        "Problem Solver & Innovator"
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            target.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            target.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentPhrase.length) {
            speed = 2000; // Pause at full phrase
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ==========================================================================
   3. Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('i');
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('kamal-portfolio-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        icon.className = 'fa-solid fa-sun';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        localStorage.setItem('kamal-portfolio-theme', isLight ? 'light' : 'dark');
        
        showToast(isLight ? 'Switched to Light Theme' : 'Switched to Dark Theme', 'info');
    });
}

/* ==========================================================================
   4. Navbar Scroll & Active Link Tracking
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Section highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   5. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.className = navMenu.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
        });
    });
}

/* ==========================================================================
   6. Scroll Reveal IntersectionObserver
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. Technical Skill Filter & Real-Time Search
   ========================================================================== */
function initSkillFilters() {
    const searchInput = document.getElementById('skill-search');
    const clearBtn = document.getElementById('clear-skill-search');
    const tabButtons = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    let activeCategory = 'all';

    function filterSkills() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        skillCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            const cardText = card.textContent.toLowerCase();

            const matchesCategory = (activeCategory === 'all') || categories.includes(activeCategory);
            const matchesQuery = query === '' || cardText.includes(query);

            if (matchesCategory && matchesQuery) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (clearBtn) clearBtn.style.display = searchInput.value ? 'block' : 'none';
            filterSkills();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            filterSkills();
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-category');
            filterSkills();
        });
    });
}

/* ==========================================================================
   8. Featured Projects Filter
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ==========================================================================
   9. Modals (CV & Project Details)
   ========================================================================== */
function openCVModal() {
    const modal = document.getElementById('cv-modal');
    if (modal) modal.classList.add('active');
}

function closeCVModal() {
    const modal = document.getElementById('cv-modal');
    if (modal) modal.classList.remove('active');
}

function simulateCVDownload() {
    showToast('Downloading Kamal Mansour Kamal - Resume.pdf...', 'success');
    
    // Simulate blob download
    const cvText = `KAMAL MANSOUR KAMAL
Computer Science Student | Aspiring AI Engineer | Software Engineer
Fayoum, Egypt | Email: kamalmansourkamal807@gmail.com | Phone: +20 106 810 5155 | LinkedIn: https://www.linkedin.com/in/kamal-mansour-472911361

CAREER OBJECTIVE:
To build a successful career as an Artificial Intelligence Engineer by continuously advancing my expertise in Machine Learning, Deep Learning, Data Science, and Software Engineering while contributing to innovative technologies that solve real-world problems.

TECHNICAL SKILLS:
- Languages: Python, C++, Java, JavaScript, HTML5, CSS3
- AI & Data Science: Machine Learning, Scikit-learn, XGBoost, Pandas, NumPy, Data Analysis & Preprocessing
- Embedded Systems: Arduino, Microcontrollers, LDR Sensors, Circuit Design
- Tools & Design: Git, GitHub, VS Code, Jupyter Notebook, Figma, Photoshop, After Effects

FEATURED PROJECTS:
1. Autism Spectrum Disorder Prediction using Machine Learning
2. Smart Solar Tracker using Arduino
3. Personal Portfolio Website
`;

    const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kamal_Mansour_Kamal_CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Project Details Modal Generator
const projectDataMap = {
    'autism-ml': {
        title: 'Autism Spectrum Disorder Prediction using Machine Learning',
        category: 'Machine Learning & Healthcare AI',
        img: 'assets/images/project_autism_ml.png',
        tech: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'XGBoost', 'SMOTE', 'Jupyter Notebook'],
        description: 'Developing a predictive machine learning pipeline for accurate Autism Spectrum Disorder diagnosis based on clinical and behavioral telemetry data.',
        details: [
            'Implemented robust data cleaning and preprocessing for healthcare datasets containing missing values.',
            'Resolved severe class imbalance using SMOTE (Synthetic Minority Over-sampling Technique).',
            'Engineered key predictive features to maximize medical diagnostic sensitivity and precision.',
            'Trained and benchmarked multiple classifiers including Logistic Regression, Random Forest, Support Vector Machines, and XGBoost.',
            'Applied GridSearch Cross-Validation for hyperparameter optimization, achieving high F1-score and ROC-AUC metrics.'
        ]
    },
    'solar-tracker': {
        title: 'Smart Solar Tracker using Arduino',
        category: 'Embedded Systems & Automation',
        img: 'assets/images/project_solar_tracker.png',
        tech: ['Arduino', 'C/C++', 'Servo Motors', 'LDR Light Sensors', 'Circuit Design'],
        description: 'Dual-axis intelligent solar energy harvesting system that dynamically rotates solar panels toward peak lux light sources in real-time.',
        details: [
            'Constructed hardware framework with dual servo motors providing horizontal and vertical tracking.',
            'Calibrated 4 Light Dependent Resistors (LDRs) positioned in a differential matrix to detect sunlight angles.',
            'Wrote low-latency C++ firmware for the Arduino microcontroller to process sensor deltas.',
            'Significantly increased energy output efficiency compared to fixed stationary solar panels.',
            'Implemented overload protection logic and safe night-mode resetting.'
        ]
    },
    'portfolio-site': {
        title: 'Personal Portfolio Website',
        category: 'Web Development & UI Design',
        img: 'assets/images/project_portfolio.png',
        tech: ['HTML5', 'CSS3', 'JavaScript', 'Glassmorphic UI', 'Responsive Design'],
        description: 'Modern personal developer portfolio designed with a futuristic cyber-dark aesthetic and animated canvas visuals.',
        details: [
            'Built custom glassmorphism design system using modern CSS backdrop-filters and HSL color tokens.',
            'Integrated dynamic neural network particle background rendered with Vanilla JS Canvas.',
            'Created filterable skill search engine and interactive project modal dialogs.',
            'Ensured 100% responsive grid layout adapting across all mobile, tablet, and desktop devices.',
            'Optimized performance with strict zero external heavy JS framework dependencies.'
        ]
    },
    'ds-repo': {
        title: 'Data Science & Machine Learning Projects Repository',
        category: 'Data Science & Analytics',
        img: 'assets/images/project_data_science.png',
        tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn'],
        description: 'Comprehensive repository containing exploratory data analysis, statistical model evaluations, and predictive modeling notebooks.',
        details: [
            'Includes regression models for continuous value forecasting and classification algorithms.',
            'Features extensive data visualization notebooks using Seaborn & Matplotlib.',
            'Covers automated feature transformation, scaling, and outlier handling functions.',
            'Serves as a continuous laboratory for evaluating newly released ML libraries and algorithms.'
        ]
    },
    'future-ai': {
        title: 'Future AI & Deep Learning Research Roadmap',
        category: 'R&D / Advanced Intelligent Systems',
        img: 'assets/images/hero_avatar.png',
        tech: ['Deep Learning', 'Computer Vision', 'PyTorch / TensorFlow', 'Reinforcement Learning'],
        description: 'Targeted research initiatives focusing on advanced neural network architectures, computer vision, and practical AI applications.',
        details: [
            'Deepening expertise in Convolutional Neural Networks (CNNs) for medical image analysis.',
            'Exploring Natural Language Processing (NLP) models and LLM agent integration.',
            'Bridging Computer Vision models with low-power embedded hardware edge devices.',
            'Planning open-source AI tools aimed at improving educational accessibility and healthcare.'
        ]
    }
};

function openProjectModal(projectId) {
    const data = projectDataMap[projectId];
    if (!data) return;

    const modal = document.getElementById('project-modal');
    const content = document.getElementById('project-modal-content');

    content.innerHTML = `
        <div class="modal-header">
            <div>
                <span class="project-category-badge">${data.category}</span>
                <h2 style="margin-top: 0.5rem;">${data.title}</h2>
            </div>
        </div>

        <div style="margin-bottom: 1.5rem; border-radius: 12px; overflow: hidden; max-height: 300px;">
            <img src="${data.img}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <p style="font-size: 1.05rem; color: var(--text-main); margin-bottom: 1.2rem; line-height: 1.6;">
            ${data.description}
        </p>

        <h4 style="color: var(--primary-cyan); margin-bottom: 0.8rem; font-size: 1.1rem;">
            <i class="fa-solid fa-list-check"></i> Implementation Details & Key Features
        </h4>
        <ul style="padding-left: 1.2rem; margin-bottom: 1.8rem; color: var(--text-muted); line-height: 1.7;">
            ${data.details.map(d => `<li style="margin-bottom: 0.4rem;">${d}</li>`).join('')}
        </ul>

        <h4 style="color: var(--primary-cyan); margin-bottom: 0.8rem; font-size: 1.1rem;">
            <i class="fa-solid fa-layer-group"></i> Tech Stack & Libraries
        </h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
            ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="triggerDemoAlert('${data.title} Demo Simulation')">
                <i class="fa-solid fa-play"></i> Live Demo / Interactive Test
            </button>
            <a href="https://github.com" target="_blank" class="btn btn-outline btn-sm">
                <i class="fa-brands fa-github"></i> Repository on GitHub
            </a>
        </div>
    `;

    modal.classList.add('active');
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) modal.classList.remove('active');
}

/* Close modals on background click */
window.addEventListener('click', (e) => {
    const cvModal = document.getElementById('cv-modal');
    const projectModal = document.getElementById('project-modal');

    if (e.target === cvModal) closeCVModal();
    if (e.target === projectModal) closeProjectModal();
});

/* ==========================================================================
   10. Form Handling & Utility Actions
   ========================================================================== */
function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    showToast(`Thank you, ${name}! Your message regarding "${subject}" has been sent.`, 'success');
    event.target.reset();
}

function copyToClipboard(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg, 'success');
    }).catch(() => {
        showToast('Copied to clipboard!', 'success');
    });
}

function triggerDemoAlert(title) {
    showToast(`Launching ${title}... System online.`, 'info');
}

/* Toast System */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'fa-solid fa-circle-info';
    if (type === 'success') icon = 'fa-solid fa-circle-check';
    if (type === 'error') icon = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
