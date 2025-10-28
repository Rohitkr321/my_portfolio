// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

// Navigation functionality
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

// Mobile menu toggle
navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.classList.toggle('nav-open');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
});

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
});

// Back to top button
// ===== SCROLL PROGRESS & ENHANCED BACK-TO-TOP =====
const backToTopBtn = document.getElementById('back-to-top');
const scrollProgressBar = document.getElementById('scroll-progress');
const progressRingCircle = document.querySelector('.progress-ring-circle');
const scrollPercentageText = document.getElementById('scroll-percentage');
const circumference = 2 * Math.PI * 26; // 2 * PI * radius

// Set initial stroke dasharray
if (progressRingCircle) {
    progressRingCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRingCircle.style.strokeDashoffset = circumference;
}

// Update scroll progress
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update progress bar
    if (scrollProgressBar) {
        scrollProgressBar.style.width = scrollPercent + '%';
    }
    
    // Update progress ring
    if (progressRingCircle) {
        const offset = circumference - (scrollPercent / 100) * circumference;
        progressRingCircle.style.strokeDashoffset = offset;
    }
    
    // Update percentage text
    if (scrollPercentageText) {
        scrollPercentageText.textContent = Math.round(scrollPercent) + '%';
    }
    
    // Show/hide back-to-top button
    if (backToTopBtn) {
        if (scrollTop > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
}

// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function() {
        updateScrollProgress();
    });
});

// Back to top click
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', function() {
    const heroName = document.querySelector('.hero-name .name-highlight');
    const heroTitle = document.querySelector('.title-text');
    
    if (heroName && heroTitle) {
        const originalName = heroName.textContent;
        const originalTitle = heroTitle.textContent;
        
        // Reset and animate
        setTimeout(() => {
            typeWriter(heroName, originalName, 150);
        }, 500);
        
        setTimeout(() => {
            typeWriter(heroTitle, originalTitle, 100);
        }, 1500);
    }
});

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const percentage = skillBar.style.width;
                
                // Reset width to 0
                skillBar.style.width = '0%';
                
                // Animate to target width
                setTimeout(() => {
                    skillBar.style.width = percentage;
                }, 100);
                
                observer.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize skill bars animation
document.addEventListener('DOMContentLoaded', animateSkillBars);

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/\d/g, '');
                
                let current = 0;
                const increment = target / 50;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + suffix;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', animateCounters);

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Project cards hover effect
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Tech stack items animation
document.addEventListener('DOMContentLoaded', function() {
    const techItems = document.querySelectorAll('.tech-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    techItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
});

// Form validation (if contact form is added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Loading animation
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-spinner">
            <div class="loading"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Theme toggle functionality
function toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    
    // Update icon
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme (default to dark mode)
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Default to dark mode if no preference is saved
    if (!savedTheme || savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
    }
    
    // Add click event to theme toggle
    themeToggle.addEventListener('click', toggleTheme);
});

// Enhanced timeline animation with staggered reveal
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    
                    // Add subtle bounce effect
                    entry.target.style.animation = `timelineReveal 0.6s ease-out forwards`;
                }, index * 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Add CSS animation keyframes via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes timelineReveal {
        0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        50% {
            opacity: 0.7;
            transform: translateY(-5px) scale(1.02);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .timeline-item {
        animation-fill-mode: both;
    }
`;
document.head.appendChild(style);

// Initialize timeline animation
document.addEventListener('DOMContentLoaded', animateTimeline);

// Particle effect for hero section (optional enhancement)
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s infinite linear;
        `;
        
        hero.appendChild(particle);
        particles.push(particle);
    }
}

// CSS for particle animation
const particleStyles = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;

// Add particle styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = particleStyles;
document.head.appendChild(styleSheet);

// Initialize particles (uncomment to enable)
// document.addEventListener('DOMContentLoaded', createParticles);

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Handle scroll events here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Error handling for external resources
window.addEventListener('error', function(e) {
    console.error('Error loading resource:', e.target.src || e.target.href);
    // Graceful fallback for failed resources
    if (e.target.tagName === 'LINK') {
        console.warn('CSS resource failed to load, continuing without it');
    }
}, true);

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize performance monitoring
monitorPerformance();

// Enhanced form validation
function initFormValidation() {
    const contactForm = document.querySelector('#contact-form');
    if (!contactForm) return;
    
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    contactForm.addEventListener('submit', handleFormSubmit);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(e);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Name validation
    if (field.name === 'name' && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long';
        }
    }
    
    // Message validation
    if (field.name === 'message' && value) {
        if (value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
    });
    
    if (isFormValid) {
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link with form data
        const mailtoLink = `mailto:rohitkumar9122565209@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;
        
        // Open mailto link
        window.location.href = mailtoLink;
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
    } else {
        alert('Please fix the errors in the form before submitting.');
    }
}

function showSuccessMessage() {
    const form = document.getElementById('contact-form');
    const successDiv = document.getElementById('form-success');
    
    if (form && successDiv) {
        form.style.display = 'none';
        successDiv.style.display = 'block';
        
        // Hide success message after 5 seconds and reset form
        setTimeout(() => {
            successDiv.style.display = 'none';
            form.style.display = 'block';
        }, 5000);
    }
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', initFormValidation);

// Quick Actions Menu functionality
function initQuickActions() {
    const quickActions = document.getElementById('quick-actions');
    const toggleBtn = document.getElementById('quick-menu-toggle');
    const menu = document.querySelector('.quick-actions-menu');
    
    if (!quickActions || !toggleBtn || !menu) return;
    
    // Show quick actions when user scrolls down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            quickActions.classList.add('visible');
        } else {
            quickActions.classList.remove('visible');
            menu.classList.remove('active');
            toggleBtn.classList.remove('active');
        }
    });
    
    // Toggle menu on button click
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        menu.classList.toggle('active');
        toggleBtn.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!quickActions.contains(e.target)) {
            menu.classList.remove('active');
            toggleBtn.classList.remove('active');
        }
    });
}

// Initialize quick actions
document.addEventListener('DOMContentLoaded', initQuickActions);

// Chatbot FAQ Data
const faqData = {
    // Experience related questions
    "experience": {
        keywords: ["experience", "work", "career", "job", "years"],
        answers: [
            "I have 3+ years of experience in full-stack development. I started as an Intern at General Aeronautics in 2022, then became a Software Engineer L1 from 2022-2023, and currently work as Software Engineer L3 since 2023.",
            "My professional journey includes working at General Aeronautics where I've grown from an intern to a senior software engineer, gaining expertise in various technologies and project management."
        ]
    },
    
    // Technology related questions
    "technologies": {
        keywords: ["technologies", "tech", "skills", "programming", "languages", "framework", "stack"],
        answers: [
            "I specialize in the MERN stack (MongoDB, Express.js, React, Node.js) and have extensive experience with TypeScript, JavaScript, HTML5, CSS3, Git, GitHub, APIs, AWS, and various development tools.",
            "My tech stack includes: Frontend (React, TypeScript, JavaScript, HTML5, CSS3), Backend (Node.js, Express.js), Database (MongoDB), Cloud (AWS), Version Control (Git, GitHub), and additional skills in PDF generation, Authentication, Blockchain (Solidity, Web3.js), and QR Codes."
        ]
    },
    
    // Contact related questions
    "contact": {
        keywords: ["contact", "email", "phone", "reach", "get in touch", "hire"],
        answers: [
            "You can contact me via email at rohitkumar9122565209@gmail.com or call me at +91 9334156392 or +91 7352966906. I'm located in Patna City, Bihar - 800008, India.",
            "Feel free to reach out through the contact form on this website, or connect with me on LinkedIn, GitHub, Twitter, or Facebook using the social links provided."
        ]
    },
    
    // Project related questions
    "projects": {
        keywords: ["projects", "portfolio", "work", "github", "applications"],
        answers: [
            "I've worked on several exciting projects including a Todo App with Authentication and Multer, a Discussion Portal, an E-Commerce Web App, a Team Messaging Web App, and an Awesome React Projects Collection. You can view all my projects on my GitHub profile.",
            "Some of my notable projects include: Todo App (Node.js, Express, MongoDB, Multer), Discussion Portal (TypeScript, JavaScript, HTML5, CSS3), E-Commerce App (MERN Stack, Payment Gateway), Team Messaging App (Real-time communication), and React Projects Collection."
        ]
    },
    
    // Services related questions
    "services": {
        keywords: ["services", "hire", "freelance", "work", "available", "collaborate"],
        answers: [
            "I'm available for full-stack development projects, web application development, API development, database design, cloud deployment, and technical consulting. I'm open to both full-time opportunities and freelance projects.",
            "My services include: Web Application Development, Full-Stack Development, API Development, Database Design, Cloud Solutions, Technical Consulting, and Code Review. I'm always interested in new opportunities and exciting projects."
        ]
    },
    
    // Education related questions
    "education": {
        keywords: ["education", "degree", "college", "university", "studies"],
        answers: [
            "I have a strong foundation in Computer Science with expertise in Data Structures, Algorithms, and Problem Solving using C++. My education combines theoretical knowledge with practical experience gained through professional work.",
            "I'm continuously learning and staying updated with the latest technologies and best practices in software development through hands-on projects and professional experience."
        ]
    },
    
    // Default responses
    "default": {
        keywords: ["hello", "hi", "hey", "thanks", "thank you", "goodbye", "bye"],
        answers: [
            "Hello! I'm Rohit's AI assistant. I can help you learn about his experience, technologies, projects, and how to contact him. What would you like to know?",
            "Hi there! Feel free to ask me about Rohit's work, skills, or projects. I'm here to help!",
            "Thanks for reaching out! Is there anything specific you'd like to know about Rohit's professional background or services?"
        ]
    }
};

// Chatbot functionality
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotSuggestions = document.getElementById('chatbot-suggestions');
    const chatbotNotification = document.getElementById('chatbot-notification');
    
    if (!chatbotToggle || !chatbotContainer) return;
    
    let isOpen = false;
    
    // Toggle chatbot
    chatbotToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        chatbotContainer.classList.toggle('active', isOpen);
        if (isOpen) {
            chatbotNotification.style.display = 'none';
            chatbotInput.focus();
        }
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', () => {
        isOpen = false;
        chatbotContainer.classList.remove('active');
    });
    
    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        addMessage(message, 'user');
        chatbotInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get bot response after delay
        setTimeout(() => {
            hideTypingIndicator();
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }
    
    // Send button click
    chatbotSend.addEventListener('click', sendMessage);
    
    // Enter key press
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Suggestion buttons
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            chatbotInput.value = question;
            sendMessage();
        });
    });
    
    // Add message to chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${content}</p>`;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = getCurrentTime();
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
    
    // Get bot response based on user input (AI Agent)
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Greetings
        if (message.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
            const greetings = [
                "Hello! 👋 I'm Rohit's AI Assistant. I can help you with information about his experience, skills, projects, and services. What would you like to know?",
                "Hi there! 😊 I'm here to answer any questions about Rohit's professional background. Feel free to ask me anything!",
                "Hey! Welcome! 🤖 I can provide details about Rohit's work, expertise, and accomplishments. How can I assist you?"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // Thank you
        if (message.match(/\b(thanks|thank you|appreciated|thx)\b/)) {
            return "You're welcome! 😊 Feel free to ask if you have any other questions about Rohit's work or services!";
        }
        
        // Goodbye
        if (message.match(/\b(bye|goodbye|see you|take care)\b/)) {
            return "Goodbye! 👋 Feel free to come back anytime if you have more questions. Have a great day!";
        }
        
        // Check each FAQ category
        for (const [category, data] of Object.entries(faqData)) {
            if (category === 'default') continue;
            
            const hasKeyword = data.keywords.some(keyword => 
                message.includes(keyword.toLowerCase())
            );
            
            if (hasKeyword) {
                const randomAnswer = data.answers[Math.floor(Math.random() * data.answers.length)];
                return randomAnswer;
            }
        }
        
        // Intelligent fallback for unknown questions
        if (message.includes('?')) {
            return "That's a great question! 🤔 While I might not have specific information about that, I can tell you about Rohit's experience, technical skills, projects, or services. Try asking about:\n\n• His work experience and career\n• Technologies and skills he uses\n• Projects he's built\n• How to contact him\n• Services he offers\n\nWhat would you like to know?";
        }
        
        // Generic response for statements
        return "I'm Rohit's AI Assistant! 🤖 I can help you learn about his professional background, technical expertise, and projects. Feel free to ask me anything about his work, skills, or how to get in touch!";
    }
    
    // Get current time
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Show notification after delay
    setTimeout(() => {
        if (!isOpen) {
            chatbotNotification.style.display = 'flex';
        }
    }, 5000);
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', initChatbot);

// Testimonials Slider functionality
function initTestimonialsSlider() {
    const slider = document.getElementById('testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (!slider || !slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    // Previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto-play functionality
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Start auto-play
    startAutoPlay();
    
    // Pause auto-play on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    
    // Pause auto-play when user interacts
    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        setTimeout(startAutoPlay, 10000); // Resume after 10 seconds
    });
    
    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        setTimeout(startAutoPlay, 10000); // Resume after 10 seconds
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000);
        }
    });
}

// Initialize testimonials slider
document.addEventListener('DOMContentLoaded', initTestimonialsSlider);

// Comprehensive Translation System
const translations = {
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-experience': 'Experience',
        'nav-skills': 'Skills',
        'nav-projects': 'Projects',
        'nav-certificates': 'Certificates',
        'nav-testimonials': 'Testimonials',
        'nav-contact': 'Contact',
        
        // Hero Section
        'greeting': 'Hello, I\'m',
        'title1': 'Software Engineer L3',
        'title2': 'Full Stack Developer',
        'title3': 'Full Stack Developer',
        'hero-description': 'Experienced Software Engineer with 3+ years of expertise in full-stack development. Passionate about creating innovative solutions and delivering exceptional user experiences.',
        
        // About Section
        'about-title': 'About Me',
        'about-subtitle': 'Get to know me better',
        'about-description': 'I am a passionate Software Engineer with 3+ years of experience in full-stack development. I specialize in creating innovative web solutions and delivering exceptional user experiences.',
        
        // Experience Section
        'experience-title': 'Experience',
        'experience-subtitle': 'My professional journey',
        
        // Skills Section
        'skills-title': 'Skills',
        'skills-subtitle': 'My technical expertise',
        
        // Projects Section
        'projects-title': 'Projects',
        'projects-subtitle': 'My recent work',
        
        // Certificates Section
        'certificates-title': 'Certificates',
        'certificates-subtitle': 'My achievements',
        
        // Testimonials Section
        'testimonials-title': 'What People Say',
        'testimonials-subtitle': 'Testimonials from clients and colleagues',
        
        // Contact Section
        'contact-title': 'Get In Touch',
        'contact-subtitle': 'Let\'s work together',
        'contact-description': 'I\'m always interested in new opportunities and exciting projects. Whether you have a question, want to collaborate, or just want to say hi, feel free to reach out!',
        'contact-form-title': 'Send me a Message',
        'contact-form-name': 'Name',
        'contact-form-email': 'Email',
        'contact-form-subject': 'Subject',
        'contact-form-message': 'Message',
        'contact-form-send': 'Send Message',
        
        // Buttons
        'btn-download-cv': 'Download CV',
        'btn-contact': 'Contact Me',
        'btn-view-project': 'View Project',
        'btn-view-source': 'View Source',
        
        // Footer
        'footer-rights': 'All rights reserved.',
        'footer-designed': 'Designed & Developed with ❤️ by Rohit Kumar'
    },
    
    hi: {
        'nav-home': 'होम', 'nav-about': 'अबाउट', 'nav-experience': 'अनुभव', 'nav-skills': 'स्किल्स',
        'nav-projects': 'प्रोजेक्ट्स', 'nav-certificates': 'सर्टिफिकेट्स', 'nav-testimonials': 'टेस्टिमोनियल्स', 'nav-contact': 'संपर्क',
        'greeting': 'नमस्ते, मैं हूं', 'title1': 'सॉफ्टवेयर इंजीनियर L3', 'title2': 'फुल स्टैक डेवलपर', 'title3': 'एयरोस्पेस टेक स्पेशलिस्ट',
        'hero-description': 'एयरोस्पेस टेक्नोलॉजी और फुल स्टैक डेवलपमेंट में 3+ साल के अनुभव के साथ एक अनुभवी सॉफ्टवेयर इंजीनियर।',
        'about-title': 'मेरे बारे में', 'about-subtitle': 'मुझे बेहतर जानें', 'experience-title': 'अनुभव', 'experience-subtitle': 'मेरी पेशेवर यात्रा',
        'skills-title': 'स्किल्स', 'skills-subtitle': 'मेरी तकनीकी विशेषज्ञता', 'projects-title': 'प्रोजेक्ट्स', 'projects-subtitle': 'मेरा हाल का काम',
        'certificates-title': 'सर्टिफिकेट्स', 'certificates-subtitle': 'मेरी उपलब्धियां', 'testimonials-title': 'लोग क्या कहते हैं',
        'testimonials-subtitle': 'ग्राहकों और सहकर्मियों से टेस्टिमोनियल्स', 'contact-title': 'संपर्क करें', 'contact-subtitle': 'आइए साथ काम करें',
        'contact-description': 'मैं हमेशा नए अवसरों और रोमांचक परियोजनाओं में रुचि रखता हूं।', 'contact-form-title': 'मुझे संदेश भेजें',
        'contact-form-name': 'नाम', 'contact-form-email': 'ईमेल', 'contact-form-subject': 'विषय', 'contact-form-message': 'संदेश', 'contact-form-send': 'संदेश भेजें',
        'btn-download-cv': 'सीवी डाउनलोड करें', 'btn-contact': 'संपर्क करें', 'btn-view-project': 'प्रोजेक्ट देखें', 'btn-view-source': 'सोर्स देखें',
        'footer-rights': 'सभी अधिकार सुरक्षित।', 'footer-designed': 'रोहित कुमार द्वारा ❤️ के साथ डिज़ाइन और विकसित'
    },
    
    es: {
        'nav-home': 'Inicio', 'nav-about': 'Acerca', 'nav-experience': 'Experiencia', 'nav-skills': 'Habilidades',
        'nav-projects': 'Proyectos', 'nav-certificates': 'Certificados', 'nav-testimonials': 'Testimonios', 'nav-contact': 'Contacto',
        'greeting': 'Hola, soy', 'title1': 'Ingeniero de Software L3', 'title2': 'Desarrollador Full Stack', 'title3': 'Especialista en Tecnología Aeroespacial',
        'hero-description': 'Ingeniero de Software experimentado con más de 3 años de experiencia en tecnología aeroespacial y desarrollo full stack.',
        'about-title': 'Acerca de Mí', 'about-subtitle': 'Conóceme mejor', 'experience-title': 'Experiencia', 'experience-subtitle': 'Mi viaje profesional',
        'skills-title': 'Habilidades', 'skills-subtitle': 'Mi experiencia técnica', 'projects-title': 'Proyectos', 'projects-subtitle': 'Mi trabajo reciente',
        'certificates-title': 'Certificados', 'certificates-subtitle': 'Mis logros', 'testimonials-title': 'Lo que dice la gente',
        'testimonials-subtitle': 'Testimonios de clientes y colegas', 'contact-title': 'Ponte en Contacto', 'contact-subtitle': 'Trabajemos juntos',
        'contact-description': 'Siempre estoy interesado en nuevas oportunidades y proyectos emocionantes.', 'contact-form-title': 'Envíame un Mensaje',
        'contact-form-name': 'Nombre', 'contact-form-email': 'Correo', 'contact-form-subject': 'Asunto', 'contact-form-message': 'Mensaje', 'contact-form-send': 'Enviar Mensaje',
        'btn-download-cv': 'Descargar CV', 'btn-contact': 'Contáctame', 'btn-view-project': 'Ver Proyecto', 'btn-view-source': 'Ver Código',
        'footer-rights': 'Todos los derechos reservados.', 'footer-designed': 'Diseñado y Desarrollado con ❤️ por Rohit Kumar'
    },
    
    fr: {
        'nav-home': 'Accueil', 'nav-about': 'À propos', 'nav-experience': 'Expérience', 'nav-skills': 'Compétences',
        'nav-projects': 'Projets', 'nav-certificates': 'Certificats', 'nav-testimonials': 'Témoignages', 'nav-contact': 'Contact',
        'greeting': 'Bonjour, je suis', 'title1': 'Ingénieur Logiciel L3', 'title2': 'Développeur Full Stack', 'title3': 'Spécialiste en Technologie Aérospatiale',
        'hero-description': 'Ingénieur logiciel expérimenté avec plus de 3 ans d\'expertise en technologie aérospatiale et développement full stack.',
        'about-title': 'À propos de moi', 'about-subtitle': 'Apprenez à me connaître', 'experience-title': 'Expérience', 'experience-subtitle': 'Mon parcours professionnel',
        'skills-title': 'Compétences', 'skills-subtitle': 'Mon expertise technique', 'projects-title': 'Projets', 'projects-subtitle': 'Mon travail récent',
        'certificates-title': 'Certificats', 'certificates-subtitle': 'Mes réalisations', 'testimonials-title': 'Ce que disent les gens',
        'testimonials-subtitle': 'Témoignages de clients et collègues', 'contact-title': 'Entrer en Contact', 'contact-subtitle': 'Travaillons ensemble',
        'contact-description': 'Je suis toujours intéressé par de nouvelles opportunités et des projets passionnants.', 'contact-form-title': 'M\'envoyer un Message',
        'contact-form-name': 'Nom', 'contact-form-email': 'Email', 'contact-form-subject': 'Sujet', 'contact-form-message': 'Message', 'contact-form-send': 'Envoyer le Message',
        'btn-download-cv': 'Télécharger CV', 'btn-contact': 'Me Contacter', 'btn-view-project': 'Voir le Projet', 'btn-view-source': 'Voir le Code',
        'footer-rights': 'Tous droits réservés.', 'footer-designed': 'Conçu et Développé avec ❤️ par Rohit Kumar'
    },
    
    de: {
        'nav-home': 'Startseite', 'nav-about': 'Über mich', 'nav-experience': 'Erfahrung', 'nav-skills': 'Fähigkeiten',
        'nav-projects': 'Projekte', 'nav-certificates': 'Zertifikate', 'nav-testimonials': 'Testimonials', 'nav-contact': 'Kontakt',
        'greeting': 'Hallo, ich bin', 'title1': 'Software-Ingenieur L3', 'title2': 'Full Stack Entwickler', 'title3': 'Luftfahrttechnologie-Spezialist',
        'hero-description': 'Erfahrener Software-Ingenieur mit über 3 Jahren Expertise in Luftfahrttechnologie und Full-Stack-Entwicklung.',
        'about-title': 'Über mich', 'about-subtitle': 'Lernen Sie mich besser kennen', 'experience-title': 'Erfahrung', 'experience-subtitle': 'Mein beruflicher Werdegang',
        'skills-title': 'Fähigkeiten', 'skills-subtitle': 'Meine technische Expertise', 'projects-title': 'Projekte', 'projects-subtitle': 'Meine aktuelle Arbeit',
        'certificates-title': 'Zertifikate', 'certificates-subtitle': 'Meine Erfolge', 'testimonials-title': 'Was Leute sagen',
        'testimonials-subtitle': 'Testimonials von Kunden und Kollegen', 'contact-title': 'Kontakt aufnehmen', 'contact-subtitle': 'Lassen Sie uns zusammenarbeiten',
        'contact-description': 'Ich bin immer an neuen Möglichkeiten und aufregenden Projekten interessiert.', 'contact-form-title': 'Nachricht senden',
        'contact-form-name': 'Name', 'contact-form-email': 'E-Mail', 'contact-form-subject': 'Betreff', 'contact-form-message': 'Nachricht', 'contact-form-send': 'Nachricht senden',
        'btn-download-cv': 'Lebenslauf herunterladen', 'btn-contact': 'Kontaktieren Sie mich', 'btn-view-project': 'Projekt ansehen', 'btn-view-source': 'Code ansehen',
        'footer-rights': 'Alle Rechte vorbehalten.', 'footer-designed': 'Entworfen und Entwickelt mit ❤️ von Rohit Kumar'
    },
    
    zh: {
        'nav-home': '首页', 'nav-about': '关于', 'nav-experience': '经验', 'nav-skills': '技能',
        'nav-projects': '项目', 'nav-certificates': '证书', 'nav-testimonials': '推荐', 'nav-contact': '联系',
        'greeting': '你好，我是', 'title1': '软件工程师 L3', 'title2': '全栈开发者', 'title3': '航空航天技术专家',
        'hero-description': '经验丰富的软件工程师，在航空航天技术和全栈开发方面拥有3年以上的专业知识。',
        'about-title': '关于我', 'about-subtitle': '更好地了解我', 'experience-title': '经验', 'experience-subtitle': '我的专业旅程',
        'skills-title': '技能', 'skills-subtitle': '我的技术专长', 'projects-title': '项目', 'projects-subtitle': '我最近的工作',
        'certificates-title': '证书', 'certificates-subtitle': '我的成就', 'testimonials-title': '人们怎么说',
        'testimonials-subtitle': '客户和同事的推荐', 'contact-title': '取得联系', 'contact-subtitle': '让我们一起工作',
        'contact-description': '我总是对新的机会和令人兴奋的项目感兴趣。', 'contact-form-title': '给我发消息',
        'contact-form-name': '姓名', 'contact-form-email': '邮箱', 'contact-form-subject': '主题', 'contact-form-message': '消息', 'contact-form-send': '发送消息',
        'btn-download-cv': '下载简历', 'btn-contact': '联系我', 'btn-view-project': '查看项目', 'btn-view-source': '查看源码',
        'footer-rights': '版权所有。', 'footer-designed': '由 Rohit Kumar 用 ❤️ 设计和开发'
    },
    
    ja: {
        'nav-home': 'ホーム', 'nav-about': '概要', 'nav-experience': '経験', 'nav-skills': 'スキル',
        'nav-projects': 'プロジェクト', 'nav-certificates': '証明書', 'nav-testimonials': '推薦', 'nav-contact': 'お問い合わせ',
        'greeting': 'こんにちは、私は', 'title1': 'ソフトウェアエンジニア L3', 'title2': 'フルスタック開発者', 'title3': '航空宇宙技術専門家',
        'hero-description': '航空宇宙技術とフルスタック開発において3年以上の専門知識を持つ経験豊富なソフトウェアエンジニア。',
        'about-title': '私について', 'about-subtitle': '私をもっと知ってください', 'experience-title': '経験', 'experience-subtitle': '私の専門的な旅路',
        'skills-title': 'スキル', 'skills-subtitle': '私の技術的専門知識', 'projects-title': 'プロジェクト', 'projects-subtitle': '私の最近の作品',
        'certificates-title': '証明書', 'certificates-subtitle': '私の成果', 'testimonials-title': '人々の声',
        'testimonials-subtitle': 'クライアントと同僚からの推薦', 'contact-title': 'お問い合わせ', 'contact-subtitle': '一緒に働きましょう',
        'contact-description': '私は常に新しい機会とエキサイティングなプロジェクトに興味があります。', 'contact-form-title': 'メッセージを送る',
        'contact-form-name': '名前', 'contact-form-email': 'メール', 'contact-form-subject': '件名', 'contact-form-message': 'メッセージ', 'contact-form-send': 'メッセージを送信',
        'btn-download-cv': '履歴書をダウンロード', 'btn-contact': 'お問い合わせ', 'btn-view-project': 'プロジェクトを見る', 'btn-view-source': 'ソースを見る',
        'footer-rights': '全著作権所有。', 'footer-designed': 'Rohit Kumar により ❤️ で設計・開発'
    },
    
    ar: {
        'nav-home': 'الرئيسية', 'nav-about': 'حولي', 'nav-experience': 'الخبرة', 'nav-skills': 'المهارات',
        'nav-projects': 'المشاريع', 'nav-certificates': 'الشهادات', 'nav-testimonials': 'الشهادات', 'nav-contact': 'اتصل',
        'greeting': 'مرحبا، أنا', 'title1': 'مهندس برمجيات L3', 'title2': 'مطور Full Stack', 'title3': 'متخصص تقنية الفضاء',
        'hero-description': 'مهندس برمجيات ذو خبرة مع أكثر من 3 سنوات من الخبرة في تقنية الفضاء وتطوير Full Stack.',
        'about-title': 'حولي', 'about-subtitle': 'تعرف علي أكثر', 'experience-title': 'الخبرة', 'experience-subtitle': 'رحلتي المهنية',
        'skills-title': 'المهارات', 'skills-subtitle': 'خبرتي التقنية', 'projects-title': 'المشاريع', 'projects-subtitle': 'عملي الأخير',
        'certificates-title': 'الشهادات', 'certificates-subtitle': 'إنجازاتي', 'testimonials-title': 'ما يقوله الناس',
        'testimonials-subtitle': 'شهادات من العملاء والزملاء', 'contact-title': 'تواصل معي', 'contact-subtitle': 'دعنا نعمل معا',
        'contact-description': 'أنا مهتم دائما بالفرص الجديدة والمشاريع المثيرة.', 'contact-form-title': 'أرسل لي رسالة',
        'contact-form-name': 'الاسم', 'contact-form-email': 'البريد الإلكتروني', 'contact-form-subject': 'الموضوع', 'contact-form-message': 'الرسالة', 'contact-form-send': 'إرسال الرسالة',
        'btn-download-cv': 'تحميل السيرة الذاتية', 'btn-contact': 'اتصل بي', 'btn-view-project': 'عرض المشروع', 'btn-view-source': 'عرض الكود',
        'footer-rights': 'جميع الحقوق محفوظة.', 'footer-designed': 'صمم وطور بـ ❤️ بواسطة Rohit Kumar'
    }
};

let currentLanguage = 'en';

// Translation functionality with dropdown
function initTranslation() {
    const languageDropdown = document.getElementById('language-dropdown');
    const languageToggle = document.getElementById('language-toggle');
    const languageMenu = document.getElementById('language-menu');
    const languageOptions = document.querySelectorAll('.language-option');
    const languageText = document.querySelector('.language-text');
    
    if (!languageDropdown || !languageToggle) return;
    
    // Language names mapping
    const languageNames = {
        'en': 'English',
        'hi': 'हिन्दी',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'zh': '中文',
        'ja': '日本語',
        'ar': 'العربية'
    };
    
    // Load saved language preference
    const savedLanguage = localStorage.getItem('portfolio-language') || 'en';
    currentLanguage = savedLanguage;
    updateLanguageDisplay();
    translatePage();
    
    // Toggle dropdown
    languageToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('active');
    });
    
    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.getAttribute('data-lang');
            currentLanguage = selectedLang;
            localStorage.setItem('portfolio-language', currentLanguage);
            updateLanguageDisplay();
            translatePage();
            languageDropdown.classList.remove('active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!languageDropdown.contains(e.target)) {
            languageDropdown.classList.remove('active');
        }
    });
    
    // Update active option
    function updateActiveOption() {
        languageOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === currentLanguage) {
                option.classList.add('active');
            }
        });
    }
    
    // Initialize active option
    updateActiveOption();
}

function updateLanguageDisplay() {
    const languageText = document.querySelector('.language-text');
    const languageNames = {
        'en': 'English',
        'hi': 'हिन्दी',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'zh': '中文',
        'ja': '日本語',
        'ar': 'العربية'
    };
    
    if (languageText) {
        languageText.textContent = languageNames[currentLanguage] || 'English';
    }
    
    // Update active option in dropdown
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === currentLanguage) {
            option.classList.add('active');
        }
    });
}

function translatePage() {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Update document title and meta description based on language
    const titles = {
        'en': 'Rohit Kumar - Software Engineer',
        'hi': 'रोहित कुमार - सॉफ्टवेयर इंजीनियर',
        'es': 'Rohit Kumar - Ingeniero de Software',
        'fr': 'Rohit Kumar - Ingénieur Logiciel',
        'de': 'Rohit Kumar - Software-Ingenieur',
        'zh': 'Rohit Kumar - 软件工程师',
        'ja': 'Rohit Kumar - ソフトウェアエンジニア',
        'ar': 'روهيت كومار - مهندس برمجيات'
    };
    
    const descriptions = {
        'en': 'Experienced Software Engineer specializing in full-stack development',
        'hi': 'फुल स्टैक डेवलपमेंट में विशेषज्ञ सॉफ्टवेयर इंजीनियर',
        'es': 'Ingeniero de Software experimentado especializado en desarrollo full stack',
        'fr': 'Ingénieur logiciel expérimenté spécialisé en développement full stack',
        'de': 'Erfahrener Software-Ingenieur spezialisiert auf Full-Stack-Entwicklung',
        'zh': '经验丰富的软件工程师，专精于全栈开发',
        'ja': 'フルスタック開発を専門とする経験豊富なソフトウェアエンジニア',
        'ar': 'مهندس برمجيات ذو خبرة متخصص في تطوير Full Stack'
    };
    
    document.title = titles[currentLanguage] || titles['en'];
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', descriptions[currentLanguage] || descriptions['en']);
    }
}

// Initialize translation
document.addEventListener('DOMContentLoaded', initTranslation);

// Console welcome message
console.log(`
🚀 Welcome to Rohit Kumar's Portfolio!
💻 Full Stack Developer @ General Aeronautics
📧 Contact: rohitkumar9122565209@gmail.com
🔗 GitHub: https://github.com/Rohitkr321
`);

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Enhanced typing animation
function initTypingAnimation() {
    const nameElement = document.querySelector('.typing-animation');
    if (!nameElement) return;
    
    // Clear any existing content and set the correct text
    const correctText = 'Rohit Kumar';
    
    // Reset the element completely
    nameElement.innerHTML = '';
    nameElement.textContent = '';
    nameElement.style.borderRight = '3px solid #fbbf24';
    
    let i = 0;
    const typeWriter = () => {
        if (i < correctText.length) {
            // Use innerHTML to ensure proper rendering
            nameElement.innerHTML = correctText.substring(0, i + 1);
            i++;
            setTimeout(typeWriter, 120);
        } else {
            // Ensure final text is correct
            nameElement.innerHTML = correctText;
            // Keep cursor blinking after typing is complete
            setTimeout(() => {
                nameElement.style.borderRight = '3px solid transparent';
            }, 2000);
        }
    };
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 800);
}

// Initialize word rotation
function initWordRotation() {
    const words = document.querySelectorAll('.title-words .word');
    if (words.length === 0) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
        words.forEach((word, index) => {
            if (index === currentIndex) {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            } else {
                word.style.opacity = '0';
                word.style.transform = 'translateY(20px)';
            }
        });
        
        currentIndex = (currentIndex + 1) % words.length;
    }, 3000);
}

// Initialize particle effects
function initParticleEffects() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Parallax scrolling effect
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero::before');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Mouse tracking effect
function initMouseTracking() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth) * 100;
        const yPos = (clientY / innerHeight) * 100;
        
        hero.style.background = `
            radial-gradient(circle at ${xPos}% ${yPos}%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
            linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7209b7 100%)
        `;
    });
}

// Loading screen functionality
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingPercentage = document.querySelector('.loading-percentage');
    
    if (!loadingScreen) return;
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingProgress.style.width = progress + '%';
        loadingPercentage.textContent = Math.round(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 100);
}

// Initialize enhanced animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start loading screen
    initLoadingScreen();
    
    // Ensure name is correct first
    const nameElement = document.querySelector('.typing-animation');
    if (nameElement) {
        nameElement.textContent = 'Rohit Kumar';
    }
    
    // Wait a bit for the page to load completely
    setTimeout(() => {
        initTypingAnimation();
        initWordRotation();
        initParticleEffects();
        initParallaxEffect();
        initMouseTracking();
    }, 500);
});

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        typeWriter,
        animateSkillBars,
        animateCounters,
        validateEmail,
        validatePhone,
        debounce,
        initTypingAnimation,
        initWordRotation,
        initParticleEffects
    };
}

// Dynamic Header Background Based on Current Section
function initDynamicHeader() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    
    // Function to update navbar class based on current section
    function updateNavbarClass() {
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            
            // Check if section is in viewport (at least 50% visible)
            if (sectionTop <= window.innerHeight / 2 && sectionBottom >= window.innerHeight / 2) {
                currentSection = section.id;
            }
        });
        
        // Remove all active classes
        navbar.classList.remove('home-active', 'about-active', 'experience-active', 
                               'skills-active', 'projects-active', 'certificates-active', 
                               'testimonials-active', 'contact-active');
        
        // Add appropriate active class
        if (currentSection) {
            navbar.classList.add(`${currentSection}-active`);
        } else {
            // Default to home if no section is clearly in view
            navbar.classList.add('home-active');
        }
    }
    
    // Update on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateNavbarClass, 10);
    });
    
    // Initial call
    updateNavbarClass();
}

// Initialize dynamic header when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initDynamicHeader();
});

// ===== PROJECT FILTER FUNCTIONALITY =====
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects with smooth animation
            projectCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category');
                
                // Add staggered animation delay
                setTimeout(() => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.classList.remove('hide');
                            card.classList.add('show');
                        }, 10);
                    } else {
                        if (categories && categories.includes(filterValue)) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.classList.remove('hide');
                                card.classList.add('show');
                            }, 10);
                        } else {
                            card.classList.remove('show');
                            card.classList.add('hide');
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 400);
                        }
                    }
                }, index * 50); // Stagger animation
            });
        });
    });
}

// Initialize project filter
document.addEventListener('DOMContentLoaded', initProjectFilter);

// ===== SKILLS TRACKER WIDGET FUNCTIONALITY =====
function initSkillsTracker() {
    const trackerToggle = document.getElementById('tracker-toggle');
    const trackerContainer = document.getElementById('tracker-container');
    const trackerClose = document.getElementById('tracker-close');
    const trackerTabs = document.querySelectorAll('.tracker-tab');
    const trackerContents = document.querySelectorAll('.tracker-content');
    
    if (!trackerToggle || !trackerContainer) return;
    
    let isOpen = false;
    
    // Toggle tracker
    trackerToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        trackerContainer.classList.toggle('active', isOpen);
        
        // Animate skill bars when opening
        if (isOpen) {
            animateSkillBars();
            animateStats();
        }
    });
    
    // Close tracker
    if (trackerClose) {
        trackerClose.addEventListener('click', () => {
            isOpen = false;
            trackerContainer.classList.remove('active');
        });
    }
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        const tracker = document.getElementById('skills-tracker');
        if (!tracker.contains(e.target) && isOpen) {
            isOpen = false;
            trackerContainer.classList.remove('active');
        }
    });
    
    // Tab switching functionality
    trackerTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            trackerTabs.forEach(t => t.classList.remove('active'));
            trackerContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Animate skill bars when switching to skills tab
                if (targetTab === 'skills') {
                    setTimeout(() => animateSkillBars(), 100);
                }
                
                // Animate challenges when switching to challenges tab
                if (targetTab === 'challenges') {
                    animateChallenges();
                }
                
                // Animate badges when switching to achievements tab
                if (targetTab === 'achievements') {
                    animateBadges();
                }
            }
        });
    });
    
    // Challenge item click to toggle completion
    const challengeItems = document.querySelectorAll('.challenge-item');
    challengeItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('completed')) {
                item.classList.add('completed');
                // Add celebration effect
                const xp = item.querySelector('.challenge-xp');
                if (xp) {
                    xp.style.animation = 'none';
                    setTimeout(() => {
                        xp.style.animation = 'xpEarn 0.5s ease-out';
                    }, 10);
                }
            }
        });
    });
    
    // Animate skill bars
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-track-fill');
        skillBars.forEach((bar, index) => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100 + index * 100);
        });
    }
    
    // Animate statistics
    function animateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            const value = stat.textContent;
            const isPercentage = value.includes('%');
            const numericValue = parseInt(value);
            
            if (isNaN(numericValue)) return;
            
            let current = 0;
            const increment = numericValue / 30;
            const interval = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    stat.textContent = isPercentage ? numericValue + '%' : numericValue;
                    clearInterval(interval);
                } else {
                    stat.textContent = isPercentage ? Math.floor(current) + '%' : Math.floor(current);
                }
            }, 30);
        });
    }
    
    // Animate challenges
    function animateChallenges() {
        const challenges = document.querySelectorAll('.challenge-item');
        challenges.forEach((challenge, index) => {
            challenge.style.opacity = '0';
            challenge.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                challenge.style.transition = 'all 0.5s ease';
                challenge.style.opacity = '1';
                challenge.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
    
    // Animate badges
    function animateBadges() {
        const badges = document.querySelectorAll('.achievement-badge');
        badges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'scale(0.8) rotateY(180deg)';
            setTimeout(() => {
                badge.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                badge.style.opacity = '1';
                badge.style.transform = 'scale(1) rotateY(0deg)';
            }, index * 100);
        });
    }
}

// Add XP earn animation to CSS dynamically
const xpStyle = document.createElement('style');
xpStyle.textContent = `
    @keyframes xpEarn {
        0% { transform: scale(1); }
        50% { transform: scale(1.2) translateY(-5px); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(xpStyle);

// Initialize Skills Tracker
document.addEventListener('DOMContentLoaded', initSkillsTracker);

// ===== GITHUB ACTIVITY TRACKER WIDGET FUNCTIONALITY =====
function initGitHubTracker() {
    const githubToggle = document.getElementById('github-toggle');
    const githubContainer = document.getElementById('github-container');
    const githubClose = document.getElementById('github-close');
    
    if (!githubToggle || !githubContainer) return;
    
    let isOpen = false;
    
    // Toggle GitHub tracker
    githubToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        githubContainer.classList.toggle('active', isOpen);
        
        // Animate stats when opening
        if (isOpen) {
            animateGitHubStats();
        }
    });
    
    // Close GitHub tracker
    if (githubClose) {
        githubClose.addEventListener('click', () => {
            isOpen = false;
            githubContainer.classList.remove('active');
        });
    }
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        const tracker = document.getElementById('github-tracker');
        if (!tracker.contains(e.target) && isOpen) {
            isOpen = false;
            githubContainer.classList.remove('active');
        }
    });
    
    // Animate GitHub statistics
    function animateGitHubStats() {
        const statNumbers = document.querySelectorAll('.github-stat-card .stat-number');
        statNumbers.forEach(stat => {
            const value = stat.textContent;
            const numericValue = parseInt(value);
            
            if (isNaN(numericValue)) return;
            
            let current = 0;
            const increment = numericValue / 30;
            const interval = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    stat.textContent = numericValue;
                    clearInterval(interval);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 30);
        });
    }
}

// ===== DYNAMIC TIME-BASED GREETING =====
function initDynamicGreeting() {
    const greetingElement = document.getElementById('dynamic-greeting');
    if (!greetingElement) return;
    
    const currentHour = new Date().getHours();
    let greetingText = '';
    let greetingIcon = '';
    let greetingClass = '';
    
    if (currentHour >= 5 && currentHour < 12) {
        greetingText = 'Good Morning, I\'m';
        greetingIcon = 'fa-sun';
        greetingClass = 'greeting-morning';
    } else if (currentHour >= 12 && currentHour < 17) {
        greetingText = 'Good Afternoon, I\'m';
        greetingIcon = 'fa-cloud-sun';
        greetingClass = 'greeting-afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
        greetingText = 'Good Evening, I\'m';
        greetingIcon = 'fa-cloud-moon';
        greetingClass = 'greeting-evening';
    } else {
        greetingText = 'Good Night, I\'m';
        greetingIcon = 'fa-moon';
        greetingClass = 'greeting-night';
    }
    
    greetingElement.innerHTML = `
        <i class="greeting-icon fas ${greetingIcon}"></i>
        ${greetingText}
    `;
    greetingElement.classList.add(greetingClass);
}

// Initialize new features
document.addEventListener('DOMContentLoaded', () => {
    initDynamicGreeting();
    initSkillsComparisonChart();
    initComparisonBarsAnimation();
    initVoiceIntroduction();
});

// ===== SKILLS COMPARISON RADAR CHART =====
function initSkillsComparisonChart() {
    const canvas = document.getElementById('skillsRadarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Detect mobile screen
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    // Adjust font sizes and point sizes for mobile
    const labelFontSize = isSmallMobile ? 8 : isMobile ? 9 : 12;
    const tickFontSize = isSmallMobile ? 7 : isMobile ? 8 : 11;
    const pointRadius = isSmallMobile ? 2.5 : isMobile ? 3.5 : 5;
    const pointHoverRadius = isSmallMobile ? 4 : isMobile ? 5 : 7;
    const chartPadding = isSmallMobile ? 8 : isMobile ? 12 : 15;
    const labelPadding = isSmallMobile ? 5 : isMobile ? 8 : 10;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Backend Dev', 'Frontend Dev', 'Database', 'Cloud & DevOps', 'System Arch'],
            datasets: [
                {
                    label: 'Current Level',
                    data: [95, 88, 92, 78, 85],
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                    borderWidth: 2,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#667eea',
                    pointRadius: pointRadius,
                    pointHoverRadius: pointHoverRadius
                },
                {
                    label: 'Target Level',
                    data: [98, 95, 96, 90, 92],
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: 'rgba(102, 126, 234, 0.5)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(102, 126, 234, 0.5)',
                    pointRadius: pointRadius - 1,
                    pointHoverRadius: pointHoverRadius - 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: chartPadding,
                    bottom: chartPadding,
                    left: chartPadding,
                    right: chartPadding
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: 'rgba(255, 255, 255, 0.6)',
                        backdropColor: 'transparent',
                        font: {
                            size: tickFontSize
                        },
                        display: isMobile ? false : true
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        circular: true
                    },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            size: labelFontSize,
                            weight: '600'
                        },
                        padding: labelPadding,
                        centerPointLabels: true
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    padding: isMobile ? 8 : 12,
                    displayColors: true,
                    titleFont: {
                        size: isMobile ? 11 : 13
                    },
                    bodyFont: {
                        size: isMobile ? 10 : 12
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.r + '%';
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// ===== ANIMATE COMPARISON BARS ON SCROLL =====
function initComparisonBarsAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.comp-fill');
                fills.forEach((fill, index) => {
                    const targetWidth = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = targetWidth;
                    }, 100 + index * 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    document.querySelectorAll('.skill-comparison-item').forEach(item => {
        observer.observe(item);
    });
}

// ===== ANALYTICS DASHBOARD =====
function initAnalyticsDashboard() {
    // Animate analytics values on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateAnalyticsValues();
                animateCountryBars();
                initVisitorsChart();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const dashboard = document.getElementById('analytics-dashboard');
    if (dashboard) {
        observer.observe(dashboard);
    }
}

function animateAnalyticsValues() {
    // Total Views
    animateCounter('total-views', 15234, 1500);
    
    // Unique Visitors
    animateCounter('unique-visitors', 8945, 1500);
    
    // Average Time
    const avgTimeElement = document.getElementById('avg-time');
    if (avgTimeElement) {
        let seconds = 0;
        const targetSeconds = 187; // 3m 7s
        const interval = setInterval(() => {
            seconds += 3;
            if (seconds >= targetSeconds) {
                seconds = targetSeconds;
                clearInterval(interval);
            }
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            avgTimeElement.textContent = `${minutes}m ${secs}s`;
        }, 20);
    }
    
    // Click Rate
    animateCounter('click-rate', 67.5, 1500, true);
}

function animateCounter(elementId, target, duration, isPercentage = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = target / (duration / 20);
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = isPercentage ? target.toFixed(1) + '%' : Math.floor(target).toLocaleString();
            clearInterval(interval);
        } else {
            element.textContent = isPercentage ? current.toFixed(1) + '%' : Math.floor(current).toLocaleString();
        }
    }, 20);
}

function animateCountryBars() {
    const countryFills = document.querySelectorAll('.country-fill');
    countryFills.forEach((fill, index) => {
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, 100 + index * 150);
    });
}

function initVisitorsChart() {
    const canvas = document.getElementById('visitorsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Visitors',
                data: [1200, 1900, 1500, 2400, 2800, 3200, 3800, 4200, 4800, 5200, 5800, 6500],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)',
                        callback: function(value) {
                            return value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value;
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.6)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Visitors: ' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}