// Variables globales
let currentSlide = 0;
const indicators = document.querySelectorAll('.indicator');
const heroImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1470&h=613&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1470&h=613&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1470&h=613&fit=crop'
];
const heroTexts = [
    { title: 'NOUVELLE COLLECTION', subtitle: 'Découvrez les dernières tendances de la mode' },
    { title: 'STYLE UNIQUE', subtitle: 'Exprimez votre personnalité avec nos pièces exclusives' },
    { title: 'QUALITÉ PREMIUM', subtitle: 'Des matériaux nobles pour un confort exceptionnel' }
];
const heroLinks = [
    '#nouveautes',
    '#collection-homme',
    '#collection-femme'
];
let slideInterval;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initHeroBanner();
    initSearch();
    initMobileMenu();
    initNewsletter();
});

// Hero Banner
function initHeroBanner() {
    if (indicators.length === 0) return;
    
    // Ajouter les event listeners aux indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    startHeroSlider();
}

function startHeroSlider() {
    slideInterval = setInterval(() => {
        nextHeroSlide();
    }, 8000);
}

function nextHeroSlide() {
    currentSlide = (currentSlide + 1) % heroImages.length;
    updateHeroContent();
}

function goToSlide(index) {
    if (currentSlide === index) return; // Ne rien faire si c'est déjà le slide actif
    
    currentSlide = index;
    updateHeroContent();
    
    // Redémarrer l'intervalle
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        nextHeroSlide();
    }, 8000);
}

function updateHeroContent() {
    // Mettre à jour l'image avec transition fluide
    const heroImg = document.querySelector('.hero-image img');
    if (heroImg) {
        heroImg.style.opacity = '0';
        setTimeout(() => {
            heroImg.src = heroImages[currentSlide];
            setTimeout(() => {
                heroImg.style.opacity = '1';
            }, 50);
        }, 300);
    }
    
    // Mettre à jour le texte avec animation
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBtn = document.querySelector('.hero-btn');
    
    if (heroTitle && heroSubtitle) {
        heroTitle.style.opacity = '0';
        heroSubtitle.style.opacity = '0';
        
        setTimeout(() => {
            heroTitle.textContent = heroTexts[currentSlide].title;
            heroSubtitle.textContent = heroTexts[currentSlide].subtitle;
            if (heroBtn) heroBtn.href = heroLinks[currentSlide];
            setTimeout(() => {
                heroTitle.style.opacity = '1';
                heroSubtitle.style.opacity = '1';
            }, 50);
        }, 300);
    }
    
    // Mettre à jour les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Recherche
function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchBtn || !searchOverlay) return;
    
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    });
    
    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
    });
    
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
    });
}

// Menu mobile
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (!hamburger || !mobileMenu) return;
    
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    });
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
    
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', closeMobileMenu);
    });
}

// Newsletter
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            alert('Merci pour votre inscription à notre newsletter !');
            newsletterForm.reset();
        }
    });
}

// Animation au scroll pour les produits
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Gestion du panier
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');
const quickViewButtons = document.querySelectorAll('.quick-view');

quickViewButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        cartCount++;
        cartCountElement.textContent = cartCount;
        
        const cartBtn = document.querySelector('.cart-btn');
        cartBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
        
        this.textContent = 'Ajouté !';
        this.style.background = '#28a745';
        
        setTimeout(() => {
            this.textContent = 'Aperçu rapide';
            this.style.background = '#fff';
        }, 1500);
    });
});

// Pause hero slider on hover
document.addEventListener('DOMContentLoaded', function() {
    const heroBanner = document.querySelector('.hero-banner');
    if (heroBanner) {
        heroBanner.addEventListener('mouseenter', () => {
            if (slideInterval) clearInterval(slideInterval);
        });
        
        heroBanner.addEventListener('mouseleave', () => {
            startHeroSlider();
        });
    }
});

// Initialiser les animations au scroll
document.addEventListener('DOMContentLoaded', initScrollAnimations);

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const handleResize = debounce(() => {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250);

window.addEventListener('resize', handleResize);