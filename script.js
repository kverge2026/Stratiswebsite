/**
 * STRATIS Marketing Website
 * Minimal JavaScript for smooth interactions
 */

(function() {
    'use strict';

    // Header background on scroll
    const header = document.querySelector('.header');
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.webkitBackdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(to bottom, rgba(10, 10, 10, 1) 0%, transparent 100%)';
            header.style.backdropFilter = 'none';
            header.style.webkitBackdropFilter = 'none';
        }

        ticking = false;
    }

    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    // Smooth scroll for anchor links with offset for fixed header
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // Subtle fade-in for sections on scroll
    function initScrollReveal() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const sections = document.querySelectorAll('.section');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            // Skip hero section
            if (section.classList.contains('hero')) return;

            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    // Initialize
    function init() {
        window.addEventListener('scroll', onScroll, { passive: true });
        initSmoothScroll();
        initScrollReveal();
        updateHeader();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
