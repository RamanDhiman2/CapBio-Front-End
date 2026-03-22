document.addEventListener('DOMContentLoaded', () => {
    // --- GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Initial Reveal for first slide
    gsap.from(".hero-slide.active .hero-content > *", {
        duration: 1.5,
        opacity: 0,
        y: 50,
        stagger: 0.2,
        ease: "power4.out"
    });

    // Scroll Revelations
    const revealOnScroll = (elements, y = 30) => {
        gsap.from(elements, {
            duration: 1.2,
            opacity: 0,
            y: y,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elements,
                start: "top 85%"
            }
        });
    };

    revealOnScroll(".category-card");
    revealOnScroll(".product-card");
    revealOnScroll(".lookbook-content", 50);
    revealOnScroll(".benefit-item");

    // --- Hero Carousel Logic ---
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;
    let autoPlayInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;

        // Reset and trigger GSAP animations for the current slide
        gsap.fromTo(slides[index].querySelectorAll('.hero-content > *'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.3 }
        );
    };

    const nextSlide = () => {
        let index = (currentSlide + 1) % slides.length;
        showSlide(index);
    };

    const prevSlide = () => {
        let index = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(index);
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetAutoPlay();
        });
    });

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, 6000);
    };

    startAutoPlay();

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const closeMenu = document.getElementById('close-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Mobile Submenu Logic
    const parentLinks = document.querySelectorAll('.has-submenu > .nav-link');
    parentLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                const parent = link.parentElement;

                // Close other submenus
                document.querySelectorAll('.has-submenu').forEach(item => {
                    if (item !== parent) item.classList.remove('mobile-active');
                });

                parent.classList.toggle('mobile-active');
            }
        });
    });

    // --- Path Helper ---
    const isInsideMenuFolder = window.location.pathname.includes('/user/menus/');
    const isInsideUserFolder = window.location.pathname.includes('/user/') && !isInsideMenuFolder;
    const basePath = isInsideMenuFolder ? '../../' : (isInsideUserFolder ? '../' : '');

    // --- Search Functionality ---
    const searchTrigger = document.getElementById('search-trigger');
    const searchTriggerMobile = document.getElementById('search-trigger-mobile');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Sample Product Data (Synchronized with index.html)
    const products = [
        { name: "The Sage Silk Midi", price: "$68.00", image: `${basePath}assets/images/p1.png`, category: "Dresses", url: `${basePath}user/menus/dresses.html` },
        { name: "White Lace Blouse", price: "$45.00", image: `${basePath}assets/images/p2.png`, category: "Tops", url: `${basePath}user/menus/tops.html` },
        { name: "Pleated High-Waist Skirt", price: "$54.00", image: `${basePath}assets/images/p3.png`, category: "Bottoms", url: `${basePath}user/menus/bottoms.html` },
        { name: "Vintage Floral Dress", price: "$72.00", image: `${basePath}assets/images/hero.png`, category: "Dresses", url: `${basePath}user/menus/dresses.html` },
        { name: "Linen Wrap Dress", price: "$85.00", image: `${basePath}assets/images/cat_dresses.png`, category: "Dresses", url: `${basePath}user/menus/dresses.html` },
        { name: "Tailored Linen Trousers", price: "$78.00", image: `${basePath}assets/images/cat_bottoms.png`, category: "Bottoms", url: `${basePath}user/menus/bottoms.html` },
        { name: "Silk Ribbon Blouse", price: "$55.00", image: `${basePath}assets/images/cat_tops.png`, category: "Tops", url: `${basePath}user/menus/tops.html` },
        { name: "Straw Handbag", price: "$28.00", image: `${basePath}assets/images/cat_acc.png`, category: "Accessories", url: `${basePath}user/menus/accessories.html` }
    ];

    const openSearch = () => {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 500);

        // GSAP for overlay elements
        gsap.fromTo(".search-input-wrapper",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
        );
    };

    const closeSearch = () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
        searchResults.innerHTML = '';
    };

    if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
    if (searchTriggerMobile) searchTriggerMobile.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    // Search Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            searchResults.innerHTML = '';

            if (query.length < 2) return;

            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );

            if (filtered.length > 0) {
                filtered.forEach(product => {
                    const item = document.createElement('a');
                    item.href = product.url;
                    item.className = 'search-result-item';
                    item.style.textDecoration = 'none';
                    item.style.color = 'inherit';
                    item.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="search-result-info">
                            <h4>${product.name}</h4>
                            <p>${product.category} | ${product.price}</p>
                        </div>
                    `;
                    searchResults.appendChild(item);
                });
            } else {
                searchResults.innerHTML = `<div class="no-results">No products found for "${query}"</div>`;
            }
        });
    }

    // --- Cart & Quick View Logic ---
    let cart = [];
    const cartTrigger = document.getElementById('cart-trigger');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartClose = document.getElementById('cart-close');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartBadge = document.getElementById('cart-badge');
    const quickViewModal = document.getElementById('quick-view-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');

    // Update Cart UI
    const updateCartUI = () => {
        // Update Badge
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartBadge.innerText = totalItems;
        gsap.fromTo(cartBadge, { scale: 0.5 }, { scale: 1, duration: 0.4, ease: "back.out" });

        // Update Items List
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <p>Your bag is currently empty.</p>
                    <a href="${basePath}index.html" class="btn-underline">Shop New Arrivals</a>
                </div>`;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price}</p>
                        <div class="cart-item-qty">
                            <button class="qty-btn minus" data-id="${item.id}">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="qty-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <span class="cart-item-remove" data-id="${item.id}">Remove</span>
                    </div>
                </div>
            `).join('');
        }

        // Update Total
        const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
        cartTotalAmount.innerText = `$${total.toFixed(2)}`;

        // Attach listeners to new elements
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.onclick = () => updateQuantity(btn.dataset.id, 1);
        });
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.onclick = () => updateQuantity(btn.dataset.id, -1);
        });
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.onclick = () => removeFromCart(btn.dataset.id);
        });
    };

    const addToCart = (id, name, price, image) => {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        updateCartUI();
        showNotification(name);
        openCart();
    };

    const updateQuantity = (id, change) => {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                updateCartUI();
            }
        }
    };

    const removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    };

    const showNotification = (name) => {
        let notification = document.querySelector('.cart-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'cart-notification';
            document.body.appendChild(notification);
        }
        notification.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>"${name}" added to bag</span>`;
        notification.classList.add('active');
        setTimeout(() => notification.classList.remove('active'), 3000);
    };

    const openCart = () => {
        cartDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCart = () => {
        cartDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (cartTrigger) cartTrigger.onclick = openCart;
    if (cartClose) cartClose.onclick = closeCart;
    if (drawerOverlay) drawerOverlay.onclick = closeCart;

    // Quick View Logic
    const openQuickView = (productData) => {
        modalBody.innerHTML = `
            <div class="modal-img-column">
                <img src="${productData.image}" alt="${productData.name}">
            </div>
            <div class="modal-info-column">
                <span class="text-uppercase letter-spacing-1 small text-muted">Shapehugs Exclusive</span>
                <h2 class="serif">${productData.name}</h2>
                <p class="modal-price">$${productData.price}</p>
                <div class="modal-desc">
                    <p>Designed for the modern woman, this piece combines romantic European aesthetics with sustainable production. Features premium fabric and a timeless silhouette.</p>
                </div>
                <button class="hero-btn modal-add-to-cart" style="width: 100%; border: none; cursor: pointer;">Add to Bag</button>
                <div style="margin-top:20px; display: flex; flex-direction: column; gap: 10px;">
                    <p class="small text-muted" style="margin: 0;"><i class="fa-solid fa-swatchbook"></i> Size & Fit Guide</p>
                    <a href="${basePath}user/pages/product-view.html" class="small" style="color: var(--text-color); font-weight: 600; text-decoration: underline;">View Full Product Details</a>
                </div>
            </div>
        `;
        quickViewModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        modalBody.querySelector('.modal-add-to-cart').onclick = () => {
            addToCart(productData.id, productData.name, productData.price, productData.image);
            quickViewModal.classList.remove('active');
            document.body.style.overflow = '';
        };
    };

    if (modalClose) modalClose.onclick = () => {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Attach listeners to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = card.dataset.price;
        const image = card.dataset.image;

        card.querySelector('.add-to-cart').onclick = (e) => {
            e.stopPropagation();
            addToCart(id, name, price, image);
        };

        card.querySelector('.quick-view').onclick = (e) => {
            e.stopPropagation();
            openQuickView({ id, name, price, image });
        };
    });
});
