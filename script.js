document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Logic ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- Image Carousel Logic ---
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        const container = document.querySelector('.carousel-container');
        const nextBtn = document.querySelector('.next');
        const prevBtn = document.querySelector('.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;
        let slideInterval;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');
        const updateDots = (index) => {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };

        const goToSlide = (index) => {
            container.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            updateDots(currentIndex);
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            goToSlide(currentIndex);
        };
        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(currentIndex);
        };

        nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

        const startInterval = () => { slideInterval = setInterval(nextSlide, 3000); };
        const resetInterval = () => { clearInterval(slideInterval); startInterval(); };

        startInterval();
        goToSlide(0);
    }

    // --- Scroll & Counter Animation Logic ---
    const animatedCounters = document.querySelectorAll('.counter');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // --- COUNTER ANIMATION TRIGGER ---
                if (entry.target.id === 'stats' && animatedCounters.length > 0) {
                    startCounterAnimation();
                    // No need to unobserve stats, as a flag prevents re-running
                }

                // Unobserve general sections after animation for performance
                if(entry.target.id !== 'stats') {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    let counterAnimationStarted = false;
    function startCounterAnimation() {
        if (counterAnimationStarted) return;
        counterAnimationStarted = true;

        animatedCounters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let current = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // ~60 frames per second

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(updateCount);
        });
    }
});