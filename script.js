// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const faqItems = document.querySelectorAll('.faq-item');
const assessmentForm = document.getElementById('riskAssessmentForm');
const successModal = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');
const modalCloseBtn = document.querySelector('.modal-close');

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Initialize Counter
function initCounter() {
    const counterElement = document.getElementById('verifiedCount');
    if (counterElement) {
        animateCounter(counterElement, 142);
    }
}

// Mobile Menu Toggle
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

// FAQ Accordion
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// Form Submission
if (assessmentForm) {
    assessmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(assessmentForm);
        const data = {
            companyName: formData.get('companyName'),
            email: formData.get('email'),
            claims: formData.getAll('claims'),
            revenue: formData.get('revenue'),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        const submitBtn = assessmentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual FormSubmit or backend)
        try {
            // Using FormSubmit.co (free) - You'll need to replace with your email
            const response = await fetch('https://formsubmit.co/ajax/your-email@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    _subject: `New Assessment Request: ${data.companyName}`,
                    _replyto: data.email,
                    _template: 'table'
                })
            });

            if (response.ok) {
                // Show success modal
                successModal.classList.add('active');
                assessmentForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your request. Please try again or contact us directly.');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Modal Close Handlers
if (modalClose) {
    modalClose.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
}

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default for empty href or different page anchors
        if (href === '#' || href.includes('.html')) return;

        e.preventDefault();
        const targetElement = document.querySelector(href);

        if (targetElement) {
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Update active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Sticky header with shadow
function updateHeaderShadow() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initCounter();
    updateHeaderShadow();

    // Initialize animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.violation-card, .pricing-card, .step').forEach(el => {
        observer.observe(el);
    });
});

// Update on scroll
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateHeaderShadow();
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message') || document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = 'var(--danger-red)';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = '0.25rem';

    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }

    input.style.borderColor = 'var(--danger-red)';
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    if (error) {
        error.remove();
    }
    input.style.borderColor = '';
}

// Real-time form validation
if (assessmentForm) {
    const emailInput = assessmentForm.querySelector('#email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !validateEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
            } else {
                clearError(emailInput);
            }
        });
    }

    // Clear errors on input
    assessmentForm.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
}

// Add CSS for error messages
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .error-message {
        color: var(--danger-red) !important;
        font-size: 0.875rem !important;
        margin-top: 0.25rem !important;
    }
    
    input.error, select.error {
        border-color: var(--danger-red) !important;
    }
`;
document.head.appendChild(errorStyles);

// Add animation classes
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .violation-card, .pricing-card, .step {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .violation-card.animated, .pricing-card.animated, .step.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    .violation-card:nth-child(1) { transition-delay: 0.1s; }
    .violation-card:nth-child(2) { transition-delay: 0.2s; }
    .violation-card:nth-child(3) { transition-delay: 0.3s; }
    
    .step:nth-child(1) { transition-delay: 0.1s; }
    .step:nth-child(2) { transition-delay: 0.2s; }
    .step:nth-child(3) { transition-delay: 0.3s; }
`;
document.head.appendChild(animationStyles);

// Add this to your existing script.js

function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// Trigger once on load to show elements already in view
document.addEventListener("DOMContentLoaded", () => {
    reveal();

    // Ensure hamburger works on both pages
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Add a class for hamburger animation if you have one
            menuToggle.classList.toggle('is-active');
        });
    }
});

// JavaScript to handle mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    // Show hamburger only on mobile
    function checkWindowSize() {
        if (window.innerWidth <= 1023) {
            menuToggle.style.display = 'block';
            navMenu.style.display = 'none';
        } else {
            menuToggle.style.display = 'none';
            navMenu.style.display = 'flex';
        }
    }

    // Initial check
    checkWindowSize();

    // Check on resize
    window.addEventListener('resize', checkWindowSize);

    // Toggle menu on click
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Remove any existing counter animation for verified count
    const verifiedCount = document.getElementById('verifiedCount');
    if (verifiedCount) {
        verifiedCount.textContent = '24-Hour';
    }
});