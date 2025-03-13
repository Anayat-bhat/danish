document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initHamburgerMenu();
    initAnimations();
    initFormValidation();
    initBackToTop();
    initPageTransition();
    
    // Auto-update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Navigation highlighting and smooth scrolling
function initNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');

    // Highlight active section on scroll
    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= (sectionTop - 200)) {
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

    // Smooth scrolling for anchor links
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Close mobile menu if open
            const nav = document.querySelector('nav');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }

            const targetId = this.getAttribute('href').substring(1);
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Hamburger menu functionality
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('nav');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav.classList.contains('active') &&
            !event.target.closest('nav') &&
            !event.target.closest('.hamburger-menu')) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Handle all animations
function initAnimations() {
    // Initial entrance animations
    animateEntrance();

    // Scroll-based animations
    const animatedElements = {
        cards: document.querySelectorAll('.card'),
        skills: document.querySelectorAll('.skill-item'),
        contact: document.querySelectorAll('.contact-info, .contact-form')
    };

    // Initial check
    checkElementsInView(animatedElements);

    // Check on scroll
    window.addEventListener('scroll', function() {
        checkElementsInView(animatedElements);
    });
}

// Animate elements on page load
function animateEntrance() {
    const logo = document.querySelector('.logo h1');
    const profileImage = document.querySelector('.profile-image img');

    if (logo) {
        setTimeout(() => {
            logo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            logo.style.opacity = '1';
        }, 200);
    }

    if (profileImage) {
        setTimeout(() => {
            profileImage.style.transition = 'opacity 1s ease, transform 1s ease';
            profileImage.style.opacity = '1';
        }, 400);
    }
}

// Check if elements are in viewport and animate them
function checkElementsInView(elements) {
    // Check cards
    elements.cards.forEach(card => {
        if (isInViewport(card)) {
            card.classList.add('active');
        }
    });

    // Check skills
    elements.skills.forEach(skill => {
        if (isInViewport(skill)) {
            skill.classList.add('active');
            const progress = skill.querySelector('.skill-progress');
            const percentage = progress.getAttribute('data-percentage');
            progress.style.width = percentage + '%';
        }
    });

    // Check contact elements
    elements.contact.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('active');
        }
    });
}

// Helper function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight * 0.8) &&
        rect.bottom >= 0
    );
}

// Form validation and submission
function initFormValidation() {
    const form = document.querySelector('form[name="submit-to-google-sheet"]');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default to handle submission via fetch

            const submitButton = form.querySelector('.submit-btn');
            const originalButtonText = submitButton.innerHTML;
            
            const nameInput = form.querySelector('input[name="Name"]');
            const emailInput = form.querySelector('input[name="Email"]');
            const messageInput = form.querySelector('textarea[name="Message"]');
            
            let isValid = true;
            
            // Validate inputs
            if (!nameInput.value.trim()) {
                highlightInvalid(nameInput);
                isValid = false;
            } else {
                resetHighlight(nameInput);
            }
            
            if (!validateEmail(emailInput.value.trim())) {
                highlightInvalid(emailInput);
                isValid = false;
            } else {
                resetHighlight(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                highlightInvalid(messageInput);
                isValid = false;
            } else {
                resetHighlight(messageInput);
            }
            
            if (!isValid) {
                return;
            }
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            // Form is valid, submit to Google Sheets
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwybVla1tnzt7N13v7S0xZAU-dx8RpZN36S9JJwRJmkHG7Vg06X187ZIwvH0hsZlqfE0w/exec';
            
            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(response => {
                    // Remove send button
                    submitButton.style.display = 'none';
                    
                    console.log('Success!', response);
                    
                    // Clear form fields
                    nameInput.value = '';
                    emailInput.value = '';
                    messageInput.value = '';
                    
                    // Show success message
                    const formContainer = document.querySelector('.contact-form');
                    
                    // Remove existing success message if any
                    const existingMsg = formContainer.querySelector('.success-message');
                    if (existingMsg) {
                        existingMsg.remove();
                    }
                    
                    const successMsg = document.createElement('div');
                    successMsg.classList.add('success-message');
                    successMsg.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-check-circle" style="font-size: 3rem; color: #5b7a9d; margin-bottom: 15px;"></i><h3>Thank you for your message!</h3><p>I will get back to you soon.</p></div>';
                    
                    // Add success message to form
                    formContainer.appendChild(successMsg);
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMsg.remove();
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    // Restore button state
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                    // Display error message to user
                    alert('There was an error sending your message. Please try again later.');
                });
        });
    }
    
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function highlightInvalid(element) {
        element.style.boxShadow = '0 0 0 2px rgba(220, 53, 69, 0.5)';
        element.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
        element.style.transition = 'all 0.3s ease';
    }
    
    function resetHighlight(element) {
        element.style.boxShadow = '';
        element.style.backgroundColor = '';
    }
}

// Back-to-top functionality
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top a');

    backToTopButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Parallax effect on profile image
window.addEventListener('scroll', () => {
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        const scrolled = window.pageYOffset;
        profileImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Smooth page transitions
function initPageTransition() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
}