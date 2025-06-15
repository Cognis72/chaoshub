/**
 * Chaoshub Website JavaScript
 * Handles language switching, navigation, form validation, and interactive features
 */

(function() {
    'use strict';

    // Global state
    let currentLanguage = 'en';
    let currentTheme = 'light';
    
    // Language data
    const languages = {
        en: 'English',
        th: 'Thai'
    };
    
    // Theme data
    const themes = {
        light: 'light',
        dark: 'dark'
    };

    // DOM elements
    const elements = {
        langToggle: null,
        themeToggle: null,
        navToggle: null,
        navMenu: null,
        contactForm: null,
        navLinks: null
    };

    // Initialize the application
    function init() {
        // Cache DOM elements
        cacheElements();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize language
        initializeLanguage();
        
        // Initialize theme
        initializeTheme();
        
        // Initialize navigation
        initializeNavigation();
        
        // Initialize form validation
        initializeFormValidation();
        
        // Initialize smooth scrolling
        initializeSmoothScrolling();
        
        // Initialize animations
        initializeAnimations();
        
        console.log('Chaoshub website initialized successfully');
    }

    /**
     * Cache frequently used DOM elements
     */
    function cacheElements() {
        elements.langToggle = document.getElementById('lang-toggle');
        elements.themeToggle = document.getElementById('theme-toggle');
        elements.navToggle = document.getElementById('nav-toggle');
        elements.navMenu = document.getElementById('nav-menu');
        elements.contactForm = document.getElementById('contact-form');
        elements.navLinks = document.querySelectorAll('.nav-link');
    }

    /**
     * Set up all event listeners
     */
    function setupEventListeners() {
        // Language toggle
        if (elements.langToggle) {
            elements.langToggle.addEventListener('click', handleLanguageToggle);
        }

        // Theme toggle
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', handleThemeToggle);
        }

        // Navigation toggle for mobile
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', handleNavToggle);
        }

        // Close mobile menu when clicking nav links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', handleOutsideClick);

        // Handle window resize
        window.addEventListener('resize', handleWindowResize);

        // Handle scroll for header effects
        window.addEventListener('scroll', handleScroll);

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
    }

    /**
     * Initialize language functionality
     */
    function initializeLanguage() {
        // Check for saved language preference
        const savedLanguage = localStorage.getItem('chaoshub-language');
        if (savedLanguage && languages[savedLanguage]) {
            currentLanguage = savedLanguage;
        }

        // Update UI to reflect current language
        updateLanguageDisplay();
    }

    /**
     * Handle language toggle
     */
    function handleLanguageToggle() {
        currentLanguage = currentLanguage === 'en' ? 'th' : 'en';
        
        // Save preference
        localStorage.setItem('chaoshub-language', currentLanguage);
        
        // Update UI
        updateLanguageDisplay();
        
        // Update form placeholders
        updateFormPlaceholders();
        
        // Announce change for screen readers
        announceLanguageChange();
    }

    /**
     * Update all language-dependent content
     */
    function updateLanguageDisplay() {
        const elementsToUpdate = document.querySelectorAll('[data-en][data-th]');
        
        elementsToUpdate.forEach(element => {
            const newContent = element.getAttribute(`data-${currentLanguage}`);
            if (newContent) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = newContent;
                } else if (element.hasAttribute('content')) {
                    element.setAttribute('content', newContent);
                } else {
                    element.textContent = newContent;
                }
            }
        });

        // Update language toggle button
        if (elements.langToggle) {
            const toggleText = elements.langToggle.querySelector('.lang-text');
            if (toggleText) {
                toggleText.textContent = currentLanguage === 'en' ? 'ไทย' : 'EN';
            }
        }

        // Update document language attribute
        document.documentElement.lang = currentLanguage;
        
        // Update document direction for RTL languages (future-proofing)
        document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    }

    /**
     * Update form placeholders
     */
    function updateFormPlaceholders() {
        const placeholderElements = document.querySelectorAll('[data-en-placeholder][data-th-placeholder]');
        
        placeholderElements.forEach(element => {
            const placeholder = element.getAttribute(`data-${currentLanguage}-placeholder`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });
    }

    /**
     * Announce language change for accessibility
     */
    function announceLanguageChange() {
        const announcement = currentLanguage === 'en' 
            ? 'Language changed to English' 
            : 'ภาษาเปลี่ยนเป็นไทย';
        
        // Create a temporary element for screen reader announcement
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        
        document.body.appendChild(announcer);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }

    /**
     * Initialize theme functionality
     */
    function initializeTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('chaoshub-theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        if (savedTheme && themes[savedTheme]) {
            currentTheme = savedTheme;
        } else {
            currentTheme = systemTheme;
        }

        // Apply theme
        updateThemeDisplay();
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('chaoshub-theme')) {
                currentTheme = e.matches ? 'dark' : 'light';
                updateThemeDisplay();
            }
        });
    }

    /**
     * Handle theme toggle
     */
    function handleThemeToggle() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Save preference
        localStorage.setItem('chaoshub-theme', currentTheme);
        
        // Update UI
        updateThemeDisplay();
        
        // Announce change for screen readers
        announceThemeChange();
    }

    /**
     * Update theme display
     */
    function updateThemeDisplay() {
        // Update document theme attribute
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // Update theme toggle icon
        if (elements.themeToggle) {
            const icon = elements.themeToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-feather', currentTheme === 'light' ? 'moon' : 'sun');
                feather.replace();
            }
        }
    }

    /**
     * Announce theme change for accessibility
     */
    function announceThemeChange() {
        const announcement = currentTheme === 'light' 
            ? (currentLanguage === 'en' ? 'Switched to light mode' : 'เปลี่ยนเป็นโหมดสว่าง')
            : (currentLanguage === 'en' ? 'Switched to dark mode' : 'เปลี่ยนเป็นโหมดมืด');
        
        // Create a temporary element for screen reader announcement
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        
        document.body.appendChild(announcer);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }

    /**
     * Initialize navigation functionality
     */
    function initializeNavigation() {
        // Set active nav item based on current section
        updateActiveNavItem();
    }

    /**
     * Handle navigation toggle for mobile
     */
    function handleNavToggle() {
        if (elements.navMenu && elements.navToggle) {
            const isActive = elements.navMenu.classList.contains('active');
            
            if (isActive) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        }
    }

    /**
     * Open mobile navigation
     */
    function openMobileNav() {
        elements.navMenu.classList.add('active');
        elements.navToggle.setAttribute('aria-expanded', 'true');
        
        // Update icon
        const icon = elements.navToggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-feather', 'x');
            feather.replace();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close mobile navigation
     */
    function closeMobileNav() {
        if (elements.navMenu && elements.navToggle) {
            elements.navMenu.classList.remove('active');
            elements.navToggle.setAttribute('aria-expanded', 'false');
            
            // Update icon
            const icon = elements.navToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-feather', 'menu');
                feather.replace();
            }
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle clicks outside mobile nav
     */
    function handleOutsideClick(event) {
        if (elements.navMenu && elements.navMenu.classList.contains('active')) {
            if (!elements.navMenu.contains(event.target) && !elements.navToggle.contains(event.target)) {
                closeMobileNav();
            }
        }
    }

    /**
     * Handle window resize
     */
    function handleWindowResize() {
        // Close mobile nav on desktop
        if (window.innerWidth > 768) {
            closeMobileNav();
        }
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        // Add/remove header background on scroll
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        }

        // Update active navigation item
        updateActiveNavItem();
    }

    /**
     * Update active navigation item based on scroll position
     */
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

            if (scrollPos >= top && scrollPos <= bottom) {
                // Remove active class from all nav links
                elements.navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current nav link
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyboardNavigation(event) {
        // Close mobile nav on Escape
        if (event.key === 'Escape' && elements.navMenu.classList.contains('active')) {
            closeMobileNav();
        }

        // Toggle language on Alt+L
        if (event.altKey && event.key.toLowerCase() === 'l') {
            event.preventDefault();
            handleLanguageToggle();
        }

        // Toggle theme on Alt+T
        if (event.altKey && event.key.toLowerCase() === 't') {
            event.preventDefault();
            handleThemeToggle();
        }
    }

    /**
     * Initialize smooth scrolling
     */
    function initializeSmoothScrolling() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });
    }

    /**
     * Handle smooth scroll to anchor
     */
    function handleSmoothScroll(event) {
        event.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile nav if open
            closeMobileNav();
            
            // Focus target for accessibility
            setTimeout(() => {
                targetElement.focus({ preventScroll: true });
            }, 500);
        }
    }

    /**
     * Initialize form validation
     */
    function initializeFormValidation() {
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', handleFormSubmit);
            
            // Real-time validation
            const inputs = elements.contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });
        }
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        
        // Validate all fields
        const isValid = validateForm();
        
        if (isValid) {
            // Show success message
            showFormSuccess();
            
            // Reset form after delay
            setTimeout(() => {
                elements.contactForm.reset();
            }, 2000);
        } else {
            // Focus first invalid field
            const firstError = elements.contactForm.querySelector('.form-error:not(:empty)');
            if (firstError) {
                const fieldId = firstError.id.replace('-error', '');
                const field = document.getElementById(fieldId);
                if (field) {
                    field.focus();
                }
            }
        }
    }

    /**
     * Validate entire form
     */
    function validateForm() {
        const fields = ['name', 'email', 'subject', 'message'];
        let isValid = true;
        
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !validateField({ target: field })) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Validate individual field
     */
    function validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = currentLanguage === 'en' 
                ? 'This field is required' 
                : 'ช่องนี้จำเป็นต้องกรอก';
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = currentLanguage === 'en' 
                    ? 'Please enter a valid email address' 
                    : 'กรุณากรอกอีเมลที่ถูกต้อง';
            }
        }
        
        // Name validation
        if (fieldName === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = currentLanguage === 'en' 
                    ? 'Name must be at least 2 characters' 
                    : 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
            }
        }
        
        // Subject validation
        if (fieldName === 'subject' && value) {
            if (value.length < 5) {
                isValid = false;
                errorMessage = currentLanguage === 'en' 
                    ? 'Subject must be at least 5 characters' 
                    : 'หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร';
            }
        }
        
        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = currentLanguage === 'en' 
                    ? 'Message must be at least 10 characters' 
                    : 'ข้อความต้องมีอย่างน้อย 10 ตัวอักษร';
            }
        }
        
        // Update error display
        if (errorElement) {
            errorElement.textContent = errorMessage;
            field.classList.toggle('error', !isValid);
        }
        
        return isValid;
    }

    /**
     * Clear field error on input
     */
    function clearFieldError(event) {
        const field = event.target;
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errorElement && field.value.trim()) {
            errorElement.textContent = '';
            field.classList.remove('error');
        }
    }

    /**
     * Show form success message
     */
    function showFormSuccess() {
        const successMessage = currentLanguage === 'en' 
            ? 'Thank you! Your message has been sent successfully.' 
            : 'ขอบคุณ! ข้อความของคุณถูกส่งเรียบร้อยแล้ว';
        
        // Create success alert
        const alert = document.createElement('div');
        alert.className = 'form-success';
        alert.textContent = successMessage;
        alert.style.cssText = `
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            text-align: center;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Insert before form
        elements.contactForm.parentNode.insertBefore(alert, elements.contactForm);
        
        // Remove after 5 seconds
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    /**
     * Initialize animations and effects
     */
    function initializeAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .stat-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    /**
     * Utility function to debounce events
     */
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

    /**
     * Add CSS for form error states
     */
    function addErrorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .form-input.error,
            .form-textarea.error {
                border-color: #ef4444;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize the application when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addErrorStyles();
            init();
        });
    } else {
        addErrorStyles();
        init();
    }

    // Export for testing purposes (if needed)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            init,
            handleLanguageToggle,
            validateField
        };
    }
})();
