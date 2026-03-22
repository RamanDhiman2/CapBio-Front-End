document.addEventListener("DOMContentLoaded", () => {
    // --- 0. INJECT LOGO ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const logoImg = document.createElement('img');
        logoImg.src = '../admin/pics/capbioLight.png';
        logoImg.alt = 'CapBio';
        logoImg.onerror = function() { this.src = '/admin/pics/capbioLight.png'; };
        Object.assign(logoImg.style, { height: '90px', width: 'auto', display: 'block', objectFit: 'contain' });

        // Insert into the brand link or prepend to navbar
        const brand = navbar.querySelector('.navbar-brand, a[href="/"], .brand, .logo');
        if (brand) {
            brand.style.display = 'flex';
            brand.style.alignItems = 'center';
            brand.innerHTML = '';
            brand.appendChild(logoImg);
        } else {
            navbar.prepend(logoImg);
        }
    }

    // --- 0.1 INJECT FOOTER LOGO ---
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
        const logoImgFooter = document.createElement('img');
        logoImgFooter.src = '../admin/pics/capbioLight.png';
        logoImgFooter.alt = 'CapBio';
        logoImgFooter.onerror = function() { this.src = '/admin/pics/capbioLight.png'; };
        Object.assign(logoImgFooter.style, { height: '90px', width: 'auto', display: 'block', objectFit: 'contain' });
        footerLogo.innerHTML = '';
        footerLogo.appendChild(logoImgFooter);
    }

    // --- 1. LENIS SMOOTH SCROLLING ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // --- 3. MAGNETIC EFFECT ---
    const magneticEls = document.querySelectorAll('.magnetic');
    magneticEls.forEach((el) => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.8,
                ease: "power3.out",
            });
            // Also move the icon inside if it exists
            const icon = el.querySelector('i');
            if (icon) {
                gsap.to(icon, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.8,
                    ease: "power3.out"
                });
            }
        });

        el.addEventListener("mouseleave", () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
            const icon = el.querySelector('i');
            if (icon) {
                gsap.to(icon, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            }
        });
    });

    // --- 4. SWIPER SETUP ---
    const productSwiper = new Swiper('.product-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.next-btn',
            prevEl: '.prev-btn',
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
        }
    });

    // --- 5. INITIAL HERO ANIMATIONS ---
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Preparing elements
    gsap.set(['.hero-title span', '.hide-on-init'], { y: 60, opacity: 0 });
    gsap.set('.glass-card', { y: 100, opacity: 0 });

    heroTl.to('.hero-title span', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        delay: 0.2
    })
        .to('.hide-on-init', {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1
        }, "-=0.6")
        .to('.main-card', {
            y: 0,
            opacity: 1,
            duration: 1,
        }, "-=0.8")
        .to(['.side-card-1', '.side-card-2'], {
            y: 0,
            opacity: 0.8,
            duration: 1,
            stagger: 0.2
        }, "-=0.6");


    // --- 6. SCROLLTRIGGER ANIMATIONS ---

    // Fade Up Elements throughout the page
    gsap.utils.toArray('.fade-up').forEach(elem => {
        gsap.fromTo(elem,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Navbar Scroll Effect
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {
            className: 'scrolled',
            targets: '.navbar'
        }
    });

    // About Image Parallax Reveal
    gsap.fromTo('.reveal-image',
        { clipPath: 'inset(10% 10% 10% 10% round 24px)', scale: 0.9 },
        {
            clipPath: 'inset(0% 0% 0% 0% round 24px)',
            scale: 1,
            duration: 1.5,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%',
                end: 'top 20%',
                scrub: 1
            }
        }
    );

    // Number Counter Animation
    const counter = document.querySelector('.counter');
    if (counter) {
        ScrollTrigger.create({
            trigger: '.experience-badge',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                const target = parseInt(counter.getAttribute('data-target'));
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 3,
                    ease: 'power3.out',
                    snap: { innerHTML: 1 },
                    onUpdate: function () {
                        counter.innerHTML = Math.round(this.targets()[0].innerHTML);
                    }
                });
            }
        });
    }

    // Floating animation for Glass Cards on mouse move (Parallax)
    document.addEventListener("mousemove", (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;

        gsap.to('.main-card', {
            rotationY: -15 + x * 2,
            rotationX: 5 + y * 2,
            ease: 'power1.out',
            transformPerspective: 1000
        });

        gsap.to('.side-card-1', {
            rotationY: -5 + x * 1.5,
            rotationX: y * 1.5,
            ease: 'power1.out',
            transformPerspective: 1000
        });

        gsap.to('.side-card-2', {
            rotationY: -20 + x * 1.5,
            rotationX: y * 1.5,
            ease: 'power1.out',
            transformPerspective: 1000
        });
    });

    // Big Footer text parallax
    gsap.to('.big-footer-text', {
        y: 100,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true
        }
    });

    // --- 7. SEARCH MODAL FUNCTIONALITY ---
    const searchBtn = document.querySelector('[aria-label="Search"]');
    const closeSearchBtn = document.querySelector('.close-search');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');

    if (searchBtn && closeSearchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            // Slight delay to allow transition before focusing
            setTimeout(() => searchInput.focus(), 300);

            // Disable lenis scrolling while modal is open
            if (lenis) lenis.stop();
        });

        closeSearchBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('active');

            // Re-enable lenis scrolling
            if (lenis) lenis.start();
        });

        // Close on esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                if (lenis) lenis.start();
            }
        });

        // Close on clicking outside the container
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                if (lenis) lenis.start();
            }
        });
    }
});
