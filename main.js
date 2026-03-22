document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal on Scroll (Intersection Observer)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));


    // 1.5. Background Glow Mouse Tracking
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });


    // 2. Active Link Highlighting (Improved)
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop(); // Get just the filename
        if (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });


    // 3. Shared Scroll to Top Button
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollBtn.classList.add('active');
            } else {
                scrollBtn.classList.remove('active');
            }
        });
    }

    // 4. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterValue = btn.getAttribute('data-filter');
                filterBtns.forEach(b => b.classList.replace('primary', 'secondary'));
                btn.classList.replace('secondary', 'primary');
                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.classList.contains(filterValue)) {
                        card.style.display = 'block';
                        setTimeout(() => card.style.opacity = '1', 10);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    // 8. Theme Toggle (Light/Dark Mode) - Moved up to ensure themeToggle is defined for chart logic
    const themeToggle = document.getElementById('themeToggle');
    let skillsChart; // Declare skillsChart in a scope accessible by themeToggle listener

    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (icon) icon.classList.replace('fa-sun', 'fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (icon) icon.classList.replace('fa-moon', 'fa-sun');
            }
            if (skillsChart) updateChartColors(skillsChart);
        });
    }

    // 6. Interactive Skills Chart (Chart.js)
    const ctx = document.getElementById('skillsChart');
    if (ctx) {
        const getChartColors = () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            return {
                grid: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                label: isLight ? '#4a5568' : '#94a3b8'
            };
        };

        const updateChartColors = (chart) => {
            const colors = getChartColors();
            chart.options.scales.r.angleLines.color = colors.grid;
            chart.options.scales.r.grid.color = colors.grid;
            chart.options.scales.r.pointLabels.color = colors.label;
            chart.update();
        };

        const colors = getChartColors();
        skillsChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['React', 'Node.js', 'Python', 'Data Science', 'SQL', 'MongoDB'],
                datasets: [{
                    label: 'Skills',
                    data: [85, 75, 90, 85, 80, 70],
                    backgroundColor: 'rgba(166, 123, 91, 0.3)',
                    borderColor: '#a67b5b',
                    pointBackgroundColor: '#a67b5b',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#a67b5b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: colors.grid },
                        grid: { color: colors.grid },
                        pointLabels: { color: colors.label, font: { size: 12 } },
                        ticks: { display: false, stepSize: 20 },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // 7. Timeline Progress Scroll Logic
    const timelineProgress = document.querySelector('.timeline-progress');
    const timelineWrapper = document.querySelector('.timeline-wrapper');

    if (timelineProgress && timelineWrapper) {
        window.addEventListener('scroll', () => {
            const rect = timelineWrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight && rect.bottom > 0) {
                const totalHeight = rect.height;
                const scrollPercentage = ((windowHeight - rect.top) / (windowHeight + totalHeight)) * 100;
                timelineProgress.style.height = `${Math.min(Math.max(scrollPercentage, 0), 100)}%`;
            }
        });
    }
});
