document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen Management
    const loadingScreen = document.getElementById('loadingScreen');
    
    const showLoadingScreen = () => {
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    };
    
    const hideLoadingScreen = () => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    };

    // Hide loading screen after the page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => hideLoadingScreen(), 1400);
    });

    // Fallback if load event does not fire
    setTimeout(() => hideLoadingScreen(), 5000);

    // Modal close function (defined early for menu/carousel)
    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    const menuIcon = document.querySelector('.menu-icon');
    const menuDropdown = document.querySelector('.menu-dropdown');
    const shopTrigger = document.querySelector('.shop-trigger');
    const shopSubmenu = document.querySelector('#shopSubmenu');
    const submenuBack = document.querySelector('.submenu-back');

    if (menuIcon && menuDropdown) {
        const toggleMenu = () => {
            // Close any open modals to prevent overlay blocking
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => closeModal(modal));
            const isOpen = menuDropdown.classList.toggle('open');
            menuIcon.classList.toggle('open', isOpen);
            menuIcon.setAttribute('aria-expanded', String(isOpen));
            // Focus first menu item when opening
            if (isOpen) {
                setTimeout(() => {
                    const firstItem = menuDropdown.querySelector('.nav-link');
                    if (firstItem) firstItem.focus();
                }, 100);
            }
        };

        const closeMenu = () => {
            menuDropdown.classList.remove('open');
            menuIcon.classList.remove('open');
            menuIcon.setAttribute('aria-expanded', 'false');
            if (shopSubmenu) {
                shopSubmenu.classList.remove('open');
            }
        };

        menuIcon.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleMenu();
        });

        menuIcon.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMenu();
            }
        });

        document.addEventListener('click', (event) => {
            if (!menuIcon.contains(event.target) && !menuDropdown.contains(event.target) && !shopSubmenu?.contains(event.target)) {
                closeMenu();
            }
        });

        const smoothScrollTarget = (href) => {
            if (!href) return null;
            const hashIndex = href.indexOf('#');
            if (hashIndex === -1) return null;
            return href.slice(hashIndex + 1);
        };

        const isSamePageLink = (href) => {
            if (!href) return false;
            if (href.trim().startsWith('#')) return true;
            const linkUrl = new URL(href, window.location.href);
            const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
            const linkPath = linkUrl.pathname.replace(/\/index\.html$/, '/');
            return linkPath === currentPath || linkPath === '' || linkPath === '/' || linkPath === '.';
        };

        const scrollToSection = (id) => {
            const target = document.getElementById(id);
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href="#footer-contact"], a[href="#about"]');
            if (!link) return;
            const targetId = link.hash.replace('#', '');
            const target = document.getElementById(targetId);
            if (!target) return;
            event.preventDefault();
            if (menuDropdown.classList.contains('open')) {
                closeMenu();
                setTimeout(() => scrollToSection(targetId), 120);
            } else {
                scrollToSection(targetId);
            }
        });

        const smoothScrollFromHash = () => {
            const hash = window.location.hash;
            if (!hash) return;
            const id = hash.substring(1);
            const target = document.getElementById(id);
            if (!target) return;
            setTimeout(() => scrollToSection(id), 100);
        };

        smoothScrollFromHash();

        // Keyboard navigation for menu
        menuDropdown.addEventListener('keydown', (event) => {
            const menuItems = menuDropdown.querySelectorAll('.nav-link');
            const currentFocus = document.activeElement;
            const currentIndex = Array.from(menuItems).indexOf(currentFocus);

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    const nextIndex = (currentIndex + 1) % menuItems.length;
                    menuItems[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    const prevIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
                    menuItems[prevIndex].focus();
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (currentFocus) currentFocus.click();
                    break;
                case 'Escape':
                    event.preventDefault();
                    closeMenu();
                    menuIcon.focus();
                    break;
            }
        });
    }

    // Handle SHOP submenu
    if (shopTrigger && shopSubmenu) {
        shopTrigger.addEventListener('click', (event) => {
            event.preventDefault();
            shopSubmenu.classList.add('open');
            // Focus the back button for keyboard navigation
            setTimeout(() => {
                const backButton = shopSubmenu.querySelector('.submenu-back');
                if (backButton) backButton.focus();
            }, 100);
        });
    }

    if (submenuBack && shopSubmenu) {
        submenuBack.addEventListener('click', (event) => {
            event.preventDefault();
            shopSubmenu.classList.remove('open');
        });
    }

    // Keyboard navigation for submenu
    if (shopSubmenu) {
        shopSubmenu.addEventListener('keydown', (event) => {
            const submenuItems = shopSubmenu.querySelectorAll('.submenu-link');
            const backButton = shopSubmenu.querySelector('.submenu-back');
            const currentFocus = document.activeElement;
            const currentIndex = Array.from(submenuItems).indexOf(currentFocus);

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (currentFocus === backButton) {
                        submenuItems[0].focus();
                    } else {
                        const nextIndex = (currentIndex + 1) % submenuItems.length;
                        submenuItems[nextIndex].focus();
                    }
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (currentIndex <= 0) {
                        backButton.focus();
                    } else {
                        const prevIndex = currentIndex - 1;
                        submenuItems[prevIndex].focus();
                    }
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (currentFocus) currentFocus.click();
                    break;
                case 'Escape':
                    event.preventDefault();
                    shopSubmenu.classList.remove('open');
                    shopTrigger.focus();
                    break;
            }
        });
    }

    // Modal/Auth System
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const verificationModal = document.getElementById('verificationModal');
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');


    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const verificationForm = document.getElementById('verificationForm');
    const resendCodeBtn = document.getElementById('resendCodeBtn');
    const loginStatus = document.getElementById('loginStatus');
    const registerStatus = document.getElementById('registerStatus');
    const verificationStatus = document.getElementById('verificationStatus');

    const openModal = (modal) => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const setFormStatus = (element, message = '', type = '') => {
        if (!element) return;
        element.textContent = message;
        element.classList.remove('success', 'error', 'info');
        if (type) element.classList.add(type);
    };

    const setButtonLoading = (button, isLoading, defaultText) => {
        if (!button) return;
        button.disabled = isLoading;
        button.classList.toggle('loading', isLoading);
        button.textContent = isLoading ? 'Please wait...' : defaultText;
    };

    const togglePasswordVisibility = (checkboxId, ...fieldIds) => {
        const checkbox = document.getElementById(checkboxId);
        if (!checkbox) return;

        checkbox.addEventListener('change', () => {
            fieldIds.forEach((fieldId) => {
                const input = document.getElementById(fieldId);
                if (input) {
                    input.type = checkbox.checked ? 'text' : 'password';
                }
            });
        });
    };

    togglePasswordVisibility('login-show-password', 'login-password');
    togglePasswordVisibility('register-show-password', 'register-password', 'register-confirm-password');

    // Open Login Modal
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (menuDropdown) menuDropdown.classList.remove('open');
            if (menuIcon) menuIcon.setAttribute('aria-expanded', 'false');
            openModal(loginModal);
        });
    }

    // Open Register Modal
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (menuDropdown) menuDropdown.classList.remove('open');
            if (menuIcon) menuIcon.setAttribute('aria-expanded', 'false');
            openModal(registerModal);
        });
    }

    // Close Modal on Overlay Click
    const handleOverlayClick = (modal) => {
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                closeModal(modal);
                if (modal === verificationModal) clearInterval(resendInterval);
            });
        }
    };

    handleOverlayClick(loginModal);
    handleOverlayClick(registerModal);
    handleOverlayClick(verificationModal);

    // Close Modal on Close Button
    const handleCloseBtn = (modal) => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeModal(modal);
                if (modal === verificationModal) clearInterval(resendInterval);
            });
        }
    };

    handleCloseBtn(loginModal);
    handleCloseBtn(registerModal);
    handleCloseBtn(verificationModal);

    // API Configuration — prefer build-time `window.__API_BASE_URL` (Netlify)
    const API_BASE_URL = (typeof window !== 'undefined' && window.__API_BASE_URL)
        ? window.__API_BASE_URL
        : (window.location.protocol === 'file:'
            ? 'http://127.0.0.1:5000/api'
            : `${window.location.protocol}//${window.location.hostname}:5000/api`);
    const authTokenKey = 'webtechAuthToken';
    const authUserKey = 'webtechAuthUser';
    let userAuthData = null;

    const accountLabel = document.querySelector('.account-label');

    const getStoredAuth = () => {
        const token = localStorage.getItem(authTokenKey);
        const user = localStorage.getItem(authUserKey);
        if (!token || !user) return null;

        try {
            return { token, user: JSON.parse(user) };
        } catch (error) {
            return null;
        }
    };

    // Restore auth data from localStorage on page load
    const stored = getStoredAuth();
    if (stored) {
        userAuthData = stored.user;
    }

    const updateAccountUI = () => {
        if (userAuthData) {
            accountLabel.textContent = `Welcome, ${userAuthData.fullName.split(' ')[0]}`;
            if (loginBtn) loginBtn.textContent = 'LOGOUT';
        } else {
            accountLabel.textContent = 'My Account';
            if (loginBtn) loginBtn.textContent = 'LOGIN';
        }
    };

    // Update UI with restored auth data
    updateAccountUI();

    const clearAuth = () => {
        userAuthData = null;
        localStorage.removeItem(authTokenKey);
        localStorage.removeItem(authUserKey);
        updateAccountUI();
    };

    const apiCall = async (endpoint, method = 'POST', data = null) => {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };

            const stored = getStoredAuth();
            if (stored?.token) {
                options.headers.Authorization = `Bearer ${stored.token}`;
            }

            if (data) options.body = JSON.stringify(data);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const result = await response.json();
            return { success: response.ok, data: result, status: response.status };
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, data: { message: 'Network error. Please try again.' }, status: 0 };
        }
    };

    const handleAuthSuccess = (data, statusElement, message, modal) => {
        if (!data || !data.token || !data.user) {
            setFormStatus(statusElement, 'Authentication failed. Please try again.', 'error');
            return;
        }

        localStorage.setItem(authTokenKey, data.token);
        localStorage.setItem(authUserKey, JSON.stringify(data.user));
        userAuthData = data.user;
        updateAccountUI();

        setFormStatus(statusElement, message, 'success');
        if (modal) {
            setTimeout(() => {
                closeModal(modal);
                location.reload();
            }, 900);
        }
    };

    // Login Form Submit Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const email = document.getElementById('login-email')?.value.trim();
            const password = document.getElementById('login-password')?.value;

            if (!email || !password) {
                setFormStatus(loginStatus, 'Please fill in all fields.', 'error');
                return;
            }

            setButtonLoading(submitBtn, true, 'LOGIN');
            showLoadingScreen();
            const result = await apiCall('/auth/login', 'POST', { email, password });
            setButtonLoading(submitBtn, false, 'LOGIN');

            if (result.success) {
                handleAuthSuccess(result.data, loginStatus, 'Login successful!', loginModal);
                loginForm.reset();
            } else {
                hideLoadingScreen();
                setFormStatus(loginStatus, result.data.message || 'Login failed.', 'error');
            }
        });
    }

    // Register Form Submit Handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const fullName = document.getElementById('register-name')?.value.trim();
            const email = document.getElementById('register-email')?.value.trim();
            const password = document.getElementById('register-password')?.value;
            const confirmPassword = document.getElementById('register-confirm-password')?.value;

            if (!fullName || !email || !password || !confirmPassword) {
                setFormStatus(registerStatus, 'Please fill in all fields.', 'error');
                return;
            }

            if (password !== confirmPassword) {
                setFormStatus(registerStatus, 'Passwords do not match.', 'error');
                return;
            }

            if (password.length < 6) {
                setFormStatus(registerStatus, 'Password must be at least 6 characters.', 'error');
                return;
            }

            setButtonLoading(submitBtn, true, 'REGISTER');
            showLoadingScreen();
            const result = await apiCall('/auth/register', 'POST', { fullName, email, password });
            setButtonLoading(submitBtn, false, 'REGISTER');

            if (result.success) {
                handleAuthSuccess(result.data, registerStatus, 'Registration successful!', registerModal);
                registerForm.reset();
            } else {
                hideLoadingScreen();
                setFormStatus(registerStatus, result.data.message || 'Registration failed.', 'error');
            }
        });
    }

    // Footer include (for pages that use footer.html)
    const footerHtmlFallback = `
        <footer class="site-footer">
            <div class="footer-inner">
                <section class="footer-grid">
                    <div class="footer-col footer-brand">
                        <h3 class="footer-title">Seth Shoes Station</h3>
                        <p class="footer-text">
                            Premium kicks and street-ready essentials—crafted for comfort, built for everyday.
                        </p>
                        <div class="footer-divider" role="separator" aria-hidden="true"></div>
                        <div class="footer-hours">
                            <p class="footer-label">Hours</p>
                            <p class="footer-text footer-hours-text">
                                Mon–Sat: 9:00 AM – 7:00 PM<br>
                                Sunday: 11:00 AM – 5:00 PM
                            </p>
                        </div>
                    </div>

                    <div class="footer-col footer-location">
                        <h4 class="footer-title">Location</h4>
                        <p class="footer-text footer-location-text">
                            MC Arthur Highwayb Poblacion,<br>
                            Mabalacat City, Pampanga
                        </p>
                    </div>

                    <div class="footer-col">
                        <h4 class="footer-title">Contact</h4>

                        <div class="footer-contact">
                                <a class="footer-link" href="tel:+2348000000000" aria-label="Call us">
                                    <span class="footer-link-icon" aria-hidden="true">☎</span>
                                    0917 545 2272
                                </a>
                            </div>

                            <div class="footer-divider" role="separator" aria-hidden="true"></div>

                            <h4 class="footer-title">Social</h4>
                            <div class="footer-social">
                                <a class="social-icon" href="https://www.facebook.com/profile.php?id=61557322911974&sk=directory_basic_info" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <span aria-hidden="true">f</span>
                                </a>
                            </div>
                    </div>
                </section>

                <div class="footer-bottom">
                    <p class="footer-copy">© <span id="footerYear"></span> Seth Shoes Station. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;

    const loadFooter = async () => {
        const footerContainer = document.getElementById('page-footer');
        if (!footerContainer) return;

        try {
            const response = await fetch('footer.html');
            if (!response.ok) throw new Error('Footer file not found');
            const html = await response.text();
            footerContainer.innerHTML = html;
        } catch (error) {
            console.warn('Unable to load footer.html; using fallback markup.', error);
            footerContainer.innerHTML = footerHtmlFallback;
        }

        const yearEl = footerContainer.querySelector('#footerYear');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    };

    loadFooter();

        // Shopping Cart Functionality (SAFE VERSION - NO CRASH IF CART IS REMOVED)

    const cartKey = 'webtechCart';

    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const getCart = () => {
        try {
            return JSON.parse(localStorage.getItem(cartKey)) || [];
        } catch {
            return [];
        }
    };

    const saveCart = (cart) => {
        localStorage.setItem(cartKey, JSON.stringify(cart));
    };

    const updateCartBadge = () => {
        if (!cartBadge) return; // ✅ prevents crash

        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = count;
    };

    const addToCart = (productName, productPrice, productImgSrc) => {
        const cart = getCart();
        const existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: Date.now(),
                name: productName,
                price: parseFloat(productPrice.replace('$', '')),
                quantity: 1,
                imgSrc: productImgSrc || ''
            });
        }

        saveCart(cart);
        updateCartBadge();
        updateCartDisplay();
    };

    const updateCartDisplay = () => {
        if (!cartItemsContainer) return; // ✅ prevents crash

        const cart = getCart();

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
            if (cartTotalEl) cartTotalEl.textContent = '$0.00';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            return;
        }

        let total = 0;

        cartItemsContainer.innerHTML = cart.map(item => {
            total += item.price * item.quantity;

            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        ${item.imgSrc ? `<img src="${item.imgSrc}" class="cart-item-img">` : ''}
                    </div>
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">×</button>
                </div>
            `;
        }).join('');

        if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
        if (checkoutBtn) checkoutBtn.style.display = 'block';

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = parseInt(btn.getAttribute('data-id'));
                const updatedCart = cart.filter(item => item.id !== itemId);
                saveCart(updatedCart);
                updateCartBadge();
                updateCartDisplay();
            });
        });
    };

    // Cart button click (SAFE)
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateCartDisplay();
            openModal(cartModal);
        });
    }

    // Close cart modal safely
    const cartOverlay = cartModal?.querySelector('.modal-overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => closeModal(cartModal));
    }

    const cartCloseBtn = cartModal?.querySelector('.modal-close');
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', () => closeModal(cartModal));
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            setFormStatus(loginStatus, 'Checkout coming soon!', 'info');
            closeModal(cartModal);
        });
    }

    updateCartBadge();

    window.addToCart = addToCart;

    // Profile Menu Functionality
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');
    const profileLogout = document.getElementById('profileLogout');
    const profileNameEl = document.querySelector('.profile-name');
    const profileEmailEl = document.getElementById('profileEmail');
    const profileSection = document.getElementById('profileSection');
    const profileSectionName = document.getElementById('profileSectionName');
    const profileSectionEmail = document.getElementById('profileSectionEmail');
    const viewProfileName = document.getElementById('viewProfileName');
    const viewProfileEmail = document.getElementById('viewProfileEmail');
    const viewProfileMessage = document.getElementById('viewProfileMessage');

    const renderProfilePage = () => {
        if (viewProfileMessage) {
            viewProfileMessage.textContent = userAuthData ? '' : 'Please log in to view your profile.';
        }
        if (viewProfileName) {
            viewProfileName.textContent = userAuthData?.fullName || '';
        }
        if (viewProfileEmail) {
            viewProfileEmail.textContent = userAuthData?.email || '';
        }
    };

    const showUserProfileSection = () => {
        if (!profileSection || !profileSectionName || !profileSectionEmail || !userAuthData) return;
        profileSectionName.textContent = userAuthData.fullName;
        profileSectionEmail.textContent = userAuthData.email;
        profileSection.hidden = false;
        profileSection.classList.add('active');
        profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const hideUserProfileSection = () => {
        if (!profileSection) return;
        profileSection.classList.remove('active');
        profileSection.hidden = true;
    };

    if (profileBtn && profileMenu) {
        const closeProfileMenu = () => {
            profileMenu.classList.remove('active');
        };

        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            profileMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
                closeProfileMenu();
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeProfileMenu();
            }
        });

        // Update profile menu when user data changes
        const updateProfileMenu = () => {
            const logoutDivider = document.getElementById('logoutDivider');
            console.log('updateProfileMenu called, userAuthData:', userAuthData);
            
            if (userAuthData) {
                profileNameEl.textContent = userAuthData.fullName;
                profileEmailEl.textContent = userAuthData.email;
                renderProfilePage();
                // Show logout button and divider when logged in
                if (profileLogout) {
                    profileLogout.style.display = 'flex';
                    console.log('Logout button shown');
                }
                if (logoutDivider) {
                    logoutDivider.style.display = 'block';
                    console.log('Logout divider shown');
                }
            } else {
                profileNameEl.textContent = 'My Account';
                profileEmailEl.textContent = '';
                renderProfilePage();
                hideUserProfileSection();
                // Hide logout button and divider when logged out
                    if (profileLogout) {
                        profileLogout.style.display = 'none';
                        console.log('Logout button hidden');
                    }
                    if (logoutDivider) {
                        logoutDivider.style.display = 'none';
                        console.log('Logout divider hidden');
                    }
                    closeProfileMenu();
                }
            };

            // Handle profile menu item clicks
            document.querySelectorAll('.profile-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (!userAuthData) {
                        closeProfileMenu();
                        openModal(loginModal);
                        return;
                    }

                    const action = item.getAttribute('data-action');
                    console.log(`Profile action: ${action}`);
                    
                    switch(action) {
                        case 'profile':
                            closeProfileMenu();
                            window.location.href = 'profile.html';
                            break;
                        case 'settings':
                            closeProfileMenu();
                            window.location.href = 'profile.html';
                            break;
                        default:
                            closeProfileMenu();
                            break;
                    }
                });
            });

        // Handle logout
        if (profileLogout) {
            profileLogout.addEventListener('click', (e) => {
                e.preventDefault();
                clearAuth();
                updateProfileMenu();
                setFormStatus(loginStatus, 'Logged out successfully.', 'success');
                closeProfileMenu();
                setTimeout(() => location.reload(), 500);
            });
        }

        // Update profile menu on page load and when auth state changes
        updateProfileMenu();

        // Update profile menu whenever updateAccountUI is called
        const originalUpdateAccountUI = updateAccountUI;
        window.updateAccountUI = () => {
            originalUpdateAccountUI();
            updateProfileMenu();
        };
    }

    const carouselTrack = document.querySelector('.carousel-track');
    const trackWrapper = document.querySelector('.carousel-track-wrapper');
    const originalCards = Array.from(document.querySelectorAll('.carousel-card'));
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    const carousel = document.querySelector('.carousel');

    if (!carouselTrack || !trackWrapper || originalCards.length === 0 || !prevButton || !nextButton) {
        return;
    }

    const AUTOPLAY_INTERVAL = 5000;
    const ANIMATION_DURATION = 600;
    
    let currentIndex = 0;
    let isAnimating = false;
    let isTransitioning = true;
    let autoplayTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    const getVisibleCards = () => {
        return Array.from(document.querySelectorAll('.carousel-track .carousel-card'));
    };

    const updateCarouselPosition = (smooth = true) => {
        const visibleCards = getVisibleCards();
        if (visibleCards.length === 0) return;

        // Handle infinite loop wrapping
        const cardCount = visibleCards.length / 3; // Since we have original + 2 sets of clones
        
        if (currentIndex >= cardCount) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = cardCount - 1;
        }

        const card = visibleCards[currentIndex];
        const wrapperWidth = trackWrapper.offsetWidth;
        const offset = card.offsetLeft - (wrapperWidth / 2 - card.offsetWidth / 2);

        isTransitioning = smooth;
        carouselTrack.style.transition = smooth ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` : 'none';
        carouselTrack.style.transform = `translateX(-${offset}px)`;

        // Update active classes
        visibleCards.forEach((c, idx) => {
            c.classList.toggle('active', idx === currentIndex);
        });

        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, ANIMATION_DURATION);
    };

    const movePrev = () => {
        // Close any open modals to prevent overlay blocking
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => closeModal(modal));
        if (isAnimating) return;
        stopAutoplay();
        currentIndex--;
        updateCarouselPosition(true);
        startAutoplay();
    };

    const moveNext = () => {
        // Close any open modals to prevent overlay blocking
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => closeModal(modal));
        if (isAnimating) return;
        stopAutoplay();
        currentIndex++;
        updateCarouselPosition(true);
        startAutoplay();
    };

    const startAutoplay = () => {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            if (!isAnimating) {
                currentIndex++;
                updateCarouselPosition(true);
            }
        }, AUTOPLAY_INTERVAL);
    };

    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    const handleSwipeStart = (e) => {
        if (isAnimating) return;
        touchStartX = e.touches?.[0].clientX || e.clientX;
        isDragging = true;
        stopAutoplay();
    };

    const handleSwipeEnd = (e) => {
        if (!isDragging) return;
        touchEndX = e.changedTouches?.[0].clientX || e.clientX;
        isDragging = false;
        
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                moveNext();
            } else {
                movePrev();
            }
        }
        startAutoplay();
    };

    // Event Listeners
    prevButton.addEventListener('click', movePrev);
    nextButton.addEventListener('click', moveNext);
    trackWrapper.addEventListener('touchstart', handleSwipeStart, false);
    trackWrapper.addEventListener('touchend', handleSwipeEnd, false);
    trackWrapper.addEventListener('mousedown', handleSwipeStart, false);
    trackWrapper.addEventListener('mouseup', handleSwipeEnd, false);

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('resize', () => updateCarouselPosition(false));
    
    // Initialize with all cards visible
    filterCards('all');
    updateCarouselForFilter();
    startAutoplay();
});