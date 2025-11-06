// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
const animatedElements = document.querySelectorAll(`
    .service-card,
    .product-card,
    .gallery-item,
    .feature-item,
    .about-text,
    .about-image
`);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==========================================
// CONTACT FORM HANDLING
// ==========================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
});

// ==========================================
// NEWSLETTER FORM HANDLING
// ==========================================

const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = newsletterForm.querySelector('input[type="email"]').value;
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Successfully subscribed to our newsletter!', 'success');
        newsletterForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1000);
});

// ==========================================
// PRODUCT ORDER BUTTONS
// ==========================================

const orderButtons = document.querySelectorAll('.product-card .btn-small');

orderButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        showNotification(`Added ${productName} to your cart!`, 'success');
        
        // Add pulse animation
        button.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            button.style.animation = '';
        }, 500);
    });
});

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        backgroundColor: type === 'success' ? '#4caf50' : '#2196F3',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '400px'
    });
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// COUNTER ANIMATION FOR STATS
// ==========================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '') + 
                                 (element.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + 
                                 (element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
}

// Animate stats when they come into view
const stats = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            entry.target.classList.add('animated');
            animateCounter(entry.target, number);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

// ==========================================
// GALLERY MODAL (Optional Enhancement)
// ==========================================

const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('.gallery-overlay h3')?.textContent || 'Gallery Image';
        showGalleryModal(title);
    });
});

function showGalleryModal(title) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h2>${title}</h2>
            <p>Full gallery viewer would be implemented here with image carousel and full-size images.</p>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const overlay = modal.querySelector('.modal-overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
    `;
    
    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        position: relative;
        background: white;
        padding: 2rem;
        border-radius: 20px;
        max-width: 800px;
        margin: 2rem;
        z-index: 1;
    `;
    
    const closeButton = modal.querySelector('.modal-close');
    closeButton.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
    `;
    
    // Close functionality
    const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    };
    
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Add animation
    const fadeInStyle = document.createElement('style');
    fadeInStyle.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeInStyle);
    
    document.body.appendChild(modal);
}

// ==========================================
// PAGE LOAD ANIMATION
// ==========================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ==========================================
// ACTIVE NAV LINK HIGHLIGHTING
// ==========================================

const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Add active class styling
const navLinkStyle = document.createElement('style');
navLinkStyle.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(navLinkStyle);

window.addEventListener('scroll', highlightNavLink);

// ==========================================
// CONSOLE WELCOME MESSAGE
// ==========================================

console.log('%c🌾 Welcome to GreenHarvest Agriculture! 🌾', 'color: #4caf50; font-size: 20px; font-weight: bold;');
console.log('%cWebsite crafted with care for sustainable farming', 'color: #666; font-size: 12px;');
