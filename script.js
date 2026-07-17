// Initialize EmailJS - Ganti dengan kredensial EmailJS kamu
// 1. Daftar di https://www.emailjs.com/
// 2. Buat email service dan template
// 3. Ganti EMAILJS_USER_ID, EMAILJS_SERVICE_ID, dan EMAILJS_TEMPLATE_ID
const EMAILJS_USER_ID = 'YOUR_EMAILJS_USER_ID'; // Ganti dengan User ID kamu
const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID'; // Ganti dengan Service ID kamu
const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID'; // Ganti dengan Template ID kamu

// Inisialisasi EmailJS jika kredensial sudah diisi
if (EMAILJS_USER_ID !== 'YOUR_EMAILJS_USER_ID') {
    emailjs.init(EMAILJS_USER_ID);
}

// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const toast = document.createElement('div');
const preloader = document.getElementById('preloader');
const backToTop = document.getElementById('back-to-top');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupPreloader();
    setupNavbar();
    setupMobileMenu();
    setupSmoothScroll();
    setupScrollAnimations();
    setupContactForm();
    setupActiveNavLink();
    setupBackToTop();
    setupPageTransition();
    animateCounters();
});

// Navbar scroll effect
function setupNavbar() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile Menu
function setupMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
}

// Smooth Scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// Active Nav Link on Scroll
function setupActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.about-card, .skill-card, .project-card, .tech-category, .soft-skill-item, .focus-card, .contact-card, .stat-item'
    );
    
    animatableElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(el);
        
        // Add visible class when in view
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        cardObserver.observe(el);
    });
}

// Contact Form with EmailJS
function setupContactForm() {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const subject = contactForm.querySelector('input[type="text"]:nth-of-type(2)')?.value || 'No Subject';
        const message = contactForm.querySelector('textarea').value;
        
        // Jika EmailJS belum dikonfigurasi, fallback ke mailto
        if (EMAILJS_USER_ID === 'YOUR_EMAILJS_USER_ID') {
            const mailtoSubject = encodeURIComponent(`Portfolio Contact: ${subject}`);
            const mailtoBody = encodeURIComponent(`Name: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${message}`);
            window.location.href = `mailto:kensaputra4@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
            showToast('Opening your email client...');
            contactForm.reset();
            return;
        }
        
        try {
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_name: 'Kenny Saputra'
            };
            
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
            showToast(`Thank you ${name}! Your message has been sent successfully.`);
            contactForm.reset();
        } catch (error) {
            console.error('Failed to send email:', error);
            showToast('Failed to send message. Please try again or contact via WhatsApp.');
        }
    });
}

// Toast Notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Typing Effect for Hero (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Counter Animation for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Parallax effect for floating shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.floating-shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Preloader
function setupPreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    });
}

// Back to Top
function setupBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Page Transition
function setupPageTransition() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('page-transition');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.classList.add('page-transition');
        observer.observe(section);
    });
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
    }
});

// Console Easter Egg
console.log('%c Hello there! 👋', 'font-size: 20px; color: #64ffda; font-weight: bold;');
console.log('%c Interested in the code? Feel free to reach out!', 'font-size: 12px; color: #8892b0;');
