// Real Judaism Website - Main JavaScript
// Handles navigation, interactions, and utility functions

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // MOBILE NAVIGATION FUNCTIONALITY
    // ============================================
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const body = document.body;
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNavOverlay.style.display = 'flex';
            body.style.overflow = 'hidden'; // Prevent body scroll
        });
    }
    
    // Close mobile menu
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileNav);
    }
    
    // Close mobile menu when clicking on overlay
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', function(e) {
            if (e.target === mobileNavOverlay) {
                closeMobileNav();
            }
        });
    }
    
    // Close mobile menu on link click
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-overlay .nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });
    
    function closeMobileNav() {
        if (mobileNavOverlay) {
            mobileNavOverlay.style.display = 'none';
            body.style.overflow = 'auto';
        }
    }
    
    // Mobile dropdown toggle
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    
    if (dropdownToggle && mobileDropdown) {
        dropdownToggle.addEventListener('click', () => {
            dropdownToggle.classList.toggle('active');
            mobileDropdown.classList.toggle('active');
        });
    }
    
    // ============================================
    // SMOOTH SCROLLING & NAVIGATION
    // ============================================
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active navigation state
    function updateActiveNav() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = new URL(link.href).pathname;
            
            if (currentPath === linkPath || 
                (currentPath === '/' && linkPath.includes('index.html')) ||
                (currentPath === '/index.html' && linkPath === '/')) {
                link.classList.add('active');
            }
        });
    }
    
    updateActiveNav();
    
    // ============================================
    // PODCAST EPISODE LOADING
    // ============================================
    
    // Initialize episode loader for podcast pages
    if (typeof EpisodeLoader !== 'undefined') {
        console.log('Main.js: EpisodeLoader found, initializing...');
        const episodeLoader = new EpisodeLoader();
        
        // Determine which series to load based on current page
        const currentPath = window.location.pathname;
        let seriesSlug = null;
        
        if (currentPath.includes('/dating.html')) {
            seriesSlug = 'dating';
        } else if (currentPath.includes('/shalom-bayis.html') && !currentPath.includes('hebrew')) {
            seriesSlug = 'shalom-bayis';
        } else if (currentPath.includes('/shalom-bayis-hebrew.html')) {
            seriesSlug = 'shalom-bayis-hebrew';
        } else if (currentPath.includes('/shmeiras-einayim.html')) {
            seriesSlug = 'shmeiras-einayim';
        } else if (currentPath.includes('/shemiras-halashon.html')) {
            seriesSlug = 'shemiras-halashon';
        } else if (currentPath.includes('/shabbos-malkesa.html')) {
            seriesSlug = 'shabbos-malkesa';
        } else if (currentPath.includes('/mesilas-yesharim.html')) {
            seriesSlug = 'mesilas-yesharim';
        }
        
        console.log('Main.js: Determined series slug', { currentPath, seriesSlug });
        
        if (seriesSlug) {
            console.log('Main.js: Initializing series', seriesSlug);
            episodeLoader.initializeSeries(seriesSlug);
        }
    } else {
        console.log('Main.js: EpisodeLoader not found');
    }
    
    // ============================================
    // FORM HANDLING
    // ============================================
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            try {
                const formData = new FormData(this);
                
                // Submit to Formspree
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showFormMessage('Thank you! Your message has been sent. We\'ll get back to you within 24-48 hours.', 'success');
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
                
            } catch (error) {
                showFormMessage('Sorry, there was an error sending your message. Please try again or email us directly at rabbiariklapper@gmail.com.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        });
    }
    
    function showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 16px;
            margin: 24px 0;
            border-radius: 6px;
            font-weight: 500;
            ${type === 'success' ? 
                'background: #F0F9FF; color: #0369A1; border: 1px solid #0EA5E9;' :
                'background: #FEF2F2; color: #DC2626; border: 1px solid #F87171;'
            }
        `;
        
        // Insert message after form
        contactForm.insertAdjacentElement('afterend', messageDiv);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
    
    // Form validation
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#DC2626';
                isValid = false;
            } else {
                field.style.borderColor = '#E5E7EB';
            }
        });
        
        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                emailField.style.borderColor = '#DC2626';
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // ============================================
    // INTERACTIVE ELEMENTS
    // ============================================
    
    // Card hover animations on scroll
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.series-card, .blog-card, .challenge-button');
        
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
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    };
    
    // Initialize scroll animations
    animateOnScroll();
    
    // Button loading states
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('loading')) {
                return false;
            }
        });
    });
    
    // ============================================
    // EPISODE PLAYER MANAGEMENT
    // ============================================
    
    // Handle play button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('play-button') || 
            e.target.closest('.play-button')) {
            
            const playButton = e.target.classList.contains('play-button') ? 
                e.target : e.target.closest('.play-button');
            
            const episodeCard = playButton.closest('.episode-card');
            const spotifyEmbed = episodeCard.querySelector('.spotify-embed');
            
            if (spotifyEmbed) {
                // Toggle embed visibility
                spotifyEmbed.classList.toggle('active');
                
                // Update button text
                const isActive = spotifyEmbed.classList.contains('active');
                playButton.innerHTML = isActive ? '⏸️' : '▶️';
                
                // Pause other players
                if (isActive) {
                    pauseOtherPlayers(episodeCard);
                }
            }
        }
    });
    
    function pauseOtherPlayers(currentCard) {
        const allEmbeds = document.querySelectorAll('.spotify-embed.active');
        const allPlayButtons = document.querySelectorAll('.play-button');
        
        allEmbeds.forEach(embed => {
            if (embed.closest('.episode-card') !== currentCard) {
                embed.classList.remove('active');
            }
        });
        
        allPlayButtons.forEach(btn => {
            if (btn.closest('.episode-card') !== currentCard) {
                btn.innerHTML = '▶️';
            }
        });
    }
    
    // ============================================
    // RESPONSIVE BEHAVIOR
    // ============================================
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Close mobile nav on resize to desktop
            if (window.innerWidth > 767) {
                closeMobileNav();
            }
        }, 100);
    });
    
    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    
    // Escape key handling
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileNav();
        }
    });
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    // Debounce function for performance
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
    
    // Format duration from minutes to mm:ss
    window.formatDuration = function(minutes) {
        const totalSeconds = Math.round(minutes * 60);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Format date for display
    window.formatDate = function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    // ============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ============================================
    
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#main-content') || 
                          document.querySelector('main') ||
                          document.querySelector('.hero');
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Announce page changes for screen readers
    function announcePageChange(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Initialize focus management
    document.querySelectorAll('.challenge-button, .series-card').forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    console.log('Real Judaism website initialized successfully');

    const path = window.location.pathname;
    const podcastMatch = path.match(/podcasts\/([^\/]+)\.html/);
    if (podcastMatch && window.EpisodeLoader) {
        console.log('main.js: Forcing EpisodeLoader initialization for', podcastMatch[1]);
        const episodeLoader = new window.EpisodeLoader();
        episodeLoader.initializeSeries(podcastMatch[1]);
    } else {
        console.log('main.js: Not a podcast page or EpisodeLoader not found.', { path, hasEpisodeLoader: !!window.EpisodeLoader });
    }
});

// ============================================
// GLOBAL ERROR HANDLING
// ============================================

window.addEventListener('error', function(e) {
    console.error('Website error:', e.error);
    // Could implement error reporting here
});

// Service worker registration for future PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Future PWA implementation
    });
} 