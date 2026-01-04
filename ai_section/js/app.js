document.addEventListener('DOMContentLoaded', () => {
    // Prevent scroll jumps on page load
    window.scrollTo(0, 0);
    
    loadData();
    initCustomCursor();
});

// Clean up on page unload to prevent conflicts
window.addEventListener('beforeunload', () => {
    const trailContainer = document.getElementById('cursor-trail-container');
    if (trailContainer) trailContainer.innerHTML = '';
});

async function loadData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        renderProjects(data.projects);
        renderSkills(data.skills);
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback: use embedded project/skill data so the page still shows content when fetch fails
        const fallbackProjects = [
            {
                title: 'BurnPlan',
                description: 'A Java application that calculates fire risk based on Tennessee prescribed burning procedures and real-time weather data. Comprehensive testing with 100% coverage.',
                tech: ['Java', 'OpenWeatherAPI', 'GitLab'],
                link: '#'
            },
            {
                title: 'CryptoApp',
                description: 'A Python application for cryptocurrency tracking with price alerts and portfolio management. Features a Kivy GUI with persistent MySQL data storage.',
                tech: ['Python', 'Kivy', 'MySQL', 'CoinGeckoAPI'],
                link: '#'
            },
            {
                title: 'Personal Website',
                description: 'A full-stack personal portfolio website showcasing projects and skills, built with vanilla HTML, CSS, and JavaScript.',
                tech: ['HTML', 'CSS', 'JavaScript'],
                link: '../index.html'
            }
        ];

        const fallbackSkills = [
            'JavaScript', 'Python', 'Java', 'C#', 'HTML', 'CSS', 'SQL', 'Git', 'GitHub', 'GitLab', 'Object-Oriented Programming', 'Data Structures & Algorithms', 'Testing & QA'
        ];

        const projectsEl = document.getElementById('project-list');
        const skillsEl = document.getElementById('skills-list');
        if (projectsEl) renderProjects(fallbackProjects);
        if (skillsEl) renderSkills(fallbackSkills);
    }
}

function renderProjects(projects) {
    const container = document.getElementById('project-list');
    if (!container) return;
    container.innerHTML = '';
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const header = document.createElement('div');
        header.className = 'project-header';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '40');
        svg.setAttribute('height', '40');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.5');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.innerHTML = '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>';
        header.appendChild(svg);

        const titleEl = document.createElement('h3');
        titleEl.textContent = project.title || '';

        card.appendChild(header);
        card.appendChild(titleEl);

        if (project.role || project.year) {
            const meta = document.createElement('div');
            meta.className = 'project-meta';
            meta.textContent = `${project.role || ''}${project.role && project.year ? ' • ' : ''}${project.year || ''}`;
            card.appendChild(meta);
        }

        if (project.description) {
            const p = document.createElement('p');
            p.textContent = project.description;
            card.appendChild(p);
        }

        if (Array.isArray(project.highlights) && project.highlights.length) {
            const ul = document.createElement('ul');
            ul.className = 'project-highlights';
            project.highlights.forEach(h => {
                const li = document.createElement('li');
                li.textContent = h;
                ul.appendChild(li);
            });
            card.appendChild(ul);
        }

        if (Array.isArray(project.tech) && project.tech.length) {
            const techWrap = document.createElement('div');
            techWrap.className = 'tech-stack-list';
            project.tech.forEach(t => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = t;
                techWrap.appendChild(tag);
            });
            card.appendChild(techWrap);
        }

        container.appendChild(card);
    });
}

function renderSkills(skills) {
    const list = document.getElementById('skills-list');
    if (!list) return;
    list.innerHTML = '';
    skills.forEach(skill => {
        const li = document.createElement('li');
        if (typeof skill === 'string') {
            li.textContent = skill;
        } else if (skill && skill.name) {
            const name = document.createElement('span');
            name.textContent = skill.name;
            li.appendChild(name);
            const badge = document.createElement('span');
            badge.className = 'skill-badge skill-level-' + (skill.level || '').toLowerCase();
            badge.textContent = skill.level || '';
            li.appendChild(badge);
        }
        list.appendChild(li);
    });
}

/* --- CUSTOM CURSOR WITH PARTICLE TRAIL --- */
function initCustomCursor() {
    const cursorEl = document.getElementById('custom-cursor');
    const trailContainer = document.getElementById('cursor-trail-container');
    if (!cursorEl || !trailContainer) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let lastTrailX = 0;
    let lastTrailY = 0;
    let visible = false;
    let rafId = null;

    // Update target mouse position and spawn trail particles
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!visible) {
            cursorEl.style.opacity = '1';
            visible = true;
        }
        // Spawn particles along movement path
        const dx = mouseX - lastTrailX;
        const dy = mouseY - lastTrailY;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
            createParticle(mouseX, mouseY, trailContainer);
            lastTrailX = mouseX;
            lastTrailY = mouseY;
        }
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
        cursorEl.style.opacity = '0';
        visible = false;
    });

    // Show when entering window
    document.addEventListener('mouseenter', () => {
        cursorEl.style.opacity = '1';
        visible = true;
    });

    // Scale on click
    document.addEventListener('mousedown', () => {
        cursorEl.classList.add('cursor-active');
    });
    document.addEventListener('mouseup', () => {
        cursorEl.classList.remove('cursor-active');
    });

    // Scale when hovering interactive elements
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .btn, input, textarea')) {
            cursorEl.classList.add('cursor-hover');
        }
    }, true);
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .btn, input, textarea')) {
            cursorEl.classList.remove('cursor-hover');
        }
    }, true);

    // Smooth cursor following with RAF
    function animate() {
        cursorX += (mouseX - cursorX) * 0.5;
        cursorY += (mouseY - cursorY) * 0.5;
        cursorEl.style.left = cursorX + 'px';
        cursorEl.style.top = cursorY + 'px';
        rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (trailContainer) trailContainer.innerHTML = '';
    });
}

function createParticle(x, y, container) {
    const MAX_PARTICLES = 30;
    if (container.children.length >= MAX_PARTICLES) {
        const remove = container.children.length - MAX_PARTICLES + 5;
        for (let i = 0; i < remove; i++) {
            container.removeChild(container.firstChild);
        }
    }

    const particle = document.createElement('div');
    particle.classList.add('trail-particle');

    const size = 3 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    const offsetX = (Math.random() - 0.5) * 8;
    const offsetY = (Math.random() - 0.5) * 8;
    particle.style.left = `${x + offsetX}px`;
    particle.style.top = `${y + offsetY}px`;

    const duration = 0.4 + Math.random() * 0.3;
    particle.style.animationDuration = `${duration}s`;

    container.appendChild(particle);

    setTimeout(() => {
        if (particle.parentNode) particle.remove();
    }, duration * 1000 + 30);
}