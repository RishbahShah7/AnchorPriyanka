document.addEventListener('DOMContentLoaded', () => {

    // --- Elegant Cursor Follower ---
    const cursorDot = document.querySelector('.cursor-dot');
    window.addEventListener('mousemove', e => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    });

    // --- Scroll-Based Navbar Animation ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation Logic ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Ken Burns Carousel Logic ---
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    if (carouselSlides.length > 0) {
        const nextBtn = document.querySelector('.carousel-button.next');
        const prevBtn = document.querySelector('.carousel-button.prev');
        let currentSlide = 0;
        let slideInterval = setInterval(nextSlide, 5000);

        function goToSlide(n) {
            carouselSlides[currentSlide].classList.remove('active');
            currentSlide = (n + carouselSlides.length) % carouselSlides.length;
            carouselSlides[currentSlide].classList.add('active');
        }
        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
    }
    
    // --- Testimonial Slider ---
    const sliderContainer = document.querySelector('.testimonial-slider-container');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');

    if (testimonialSlides.length > 0) {
        let currentIndex = 0;
        let testimonialInterval = setInterval(showNextTestimonial, 5000);

        // Create dots
        testimonialSlides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            dot.addEventListener('click', () => {
                showTestimonial(i);
                resetTestimonialInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.testimonial-dot');

        function updateDots() {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        function showTestimonial(index) {
            currentIndex = index;
            const offset = -currentIndex * 100;
            sliderContainer.style.transform = `translateX(${offset}%)`;
            updateDots();
        }

        function showNextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonialSlides.length;
            showTestimonial(currentIndex);
        }

        function resetTestimonialInterval() {
            clearInterval(testimonialInterval);
            testimonialInterval = setInterval(showNextTestimonial, 5000);
        }

        showTestimonial(0); // Initialize
    }

    // --- Scroll & Counter Animation Logic ---
    const animatedCounters = document.querySelectorAll('.counter');
    const sections = document.querySelectorAll('section');
    let counterAnimationStarted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'stats' && !counterAnimationStarted) {
                    startCounterAnimation();
                    counterAnimationStarted = true;
                }
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    function startCounterAnimation() {
        animatedCounters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let current = 0;
            const duration = 2000;
            const increment = target / (duration / 16);

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