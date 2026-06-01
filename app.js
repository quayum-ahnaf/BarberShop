// Apex Barber Co. - Main Application Script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Interactivity
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');
    const menuIcon = mobileMenuBtn.querySelector('svg');

    function toggleMenu() {
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
            // Close menu
            mobileMenu.classList.add('hidden');
            menuIcon.innerHTML = `
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
            `;
        } else {
            // Open menu
            mobileMenu.classList.remove('hidden');
            menuIcon.innerHTML = `
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            `;
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    
    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.innerHTML = `
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
            `;
        });
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            mobileMenu.classList.add('hidden');
            menuIcon.innerHTML = `
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
            `;
        }
    });


    // 2. Interactive Service Filtering
    const filterTabs = document.querySelectorAll('.filter-tab');
    const serviceCards = document.querySelectorAll('.service-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes from all tabs
            filterTabs.forEach(t => {
                t.classList.remove('bg-accentGold', 'text-primaryBg', 'border-accentGold');
                t.classList.add('bg-secondaryBg', 'text-textSecondary', 'border-borderSlate', 'hover:border-accentGold/50');
            });

            // Add active classes to current tab
            tab.classList.remove('bg-secondaryBg', 'text-textSecondary', 'border-borderSlate', 'hover:border-accentGold/50');
            tab.classList.add('bg-accentGold', 'text-primaryBg', 'border-accentGold');

            const filterValue = tab.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset classes
                card.classList.remove('animate-fade-in-up');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden-card');
                    // Trigger reflow for animation to restart
                    void card.offsetWidth;
                    card.classList.add('animate-fade-in-up');
                } else {
                    card.classList.add('hidden-card');
                }
            });
        });
    });


    // 3. Stylized Pricing Tier Actions & Selection
    const selectTierButtons = document.querySelectorAll('.select-tier-btn');
    const bookingServiceSelect = document.getElementById('booking-service');

    selectTierButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tierName = btn.getAttribute('data-package');
            
            // Map packages to select options
            if (bookingServiceSelect) {
                // Find matching option or select by value
                for (let i = 0; i < bookingServiceSelect.options.length; i++) {
                    const option = bookingServiceSelect.options[i];
                    if (option.value.toLowerCase().includes(tierName.toLowerCase()) || 
                        option.text.toLowerCase().includes(tierName.toLowerCase())) {
                        bookingServiceSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            // Scroll smoothly to booking section
            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
                
                // Add highlight flash to the booking card for premium feedback
                const bookingFormContainer = document.getElementById('booking-form-container');
                if (bookingFormContainer) {
                    bookingFormContainer.classList.add('gold-glow-border');
                    setTimeout(() => {
                        bookingFormContainer.classList.remove('gold-glow-border');
                    }, 1500);
                }
            }
        });
    });


    // 4. Testimonial Slider Interactivity
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const dotsContainer = document.getElementById('testimonial-dots');
    
    let currentSlide = 0;
    let autoPlayInterval;

    // Create pagination dots
    slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.classList.add('w-2.5', 'h-2.5', 'rounded-full', 'bg-borderSlate', 'transition-all', 'duration-300', 'focus:outline-none');
        if (idx === 0) dot.classList.add('bg-accentGold', 'w-6');
        
        dot.addEventListener('click', () => {
            goToSlide(idx);
            resetAutoPlay();
        });
        
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('button');

    function goToSlide(n) {
        // Deactivate current slide
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('inactive');
        dots[currentSlide].classList.remove('bg-accentGold', 'w-6');
        dots[currentSlide].classList.add('bg-borderSlate');

        // Update index
        currentSlide = (n + slides.length) % slides.length;

        // Activate new slide
        slides[currentSlide].classList.remove('inactive');
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.remove('bg-borderSlate');
        dots[currentSlide].classList.add('bg-accentGold', 'w-6');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    // Auto Play Logic
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Pause auto play on hover for readability
    const sliderContainer = document.getElementById('testimonial-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }

    startAutoPlay();


    // 5. Booking Form Handlers & Custom Toast Notification
    const bookingForm = document.getElementById('appointment-form');
    const toast = document.getElementById('success-toast');
    const toastClose = document.getElementById('toast-close');
    const bookingSubmitBtn = document.getElementById('booking-submit-btn');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch Form Inputs
            const nameInput = document.getElementById('booking-name');
            const phoneInput = document.getElementById('booking-phone');
            const serviceSelect = document.getElementById('booking-service');
            const dateInput = document.getElementById('booking-date');
            const timeSelect = document.getElementById('booking-time');

            // Simple Form Validation
            let isValid = true;
            const inputs = [nameInput, phoneInput, serviceSelect, dateInput, timeSelect];

            inputs.forEach(input => {
                if (!input.value || input.value === "") {
                    input.classList.add('border-red-500');
                    input.classList.remove('border-borderSlate');
                    isValid = false;
                } else {
                    input.classList.remove('border-red-500');
                    input.classList.add('border-borderSlate');
                }
            });

            if (!isValid) return;

            // Show Loading State on Submit Button
            const originalText = bookingSubmitBtn.innerHTML;
            bookingSubmitBtn.disabled = true;
            bookingSubmitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primaryBg inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
            `;

            // Simulate API Request with 1.2s delay
            setTimeout(() => {
                // Populate Toast Content
                document.getElementById('toast-client-name').innerText = nameInput.value;
                document.getElementById('toast-service').innerText = serviceSelect.options[serviceSelect.selectedIndex].text;
                document.getElementById('toast-datetime').innerText = `${dateInput.value} at ${timeSelect.options[timeSelect.selectedIndex].text}`;

                // Show Toast
                toast.classList.remove('translate-x-full', 'opacity-0');
                toast.classList.add('translate-x-0', 'opacity-100');

                // Reset Button & Form
                bookingSubmitBtn.disabled = false;
                bookingSubmitBtn.innerHTML = originalText;
                bookingForm.reset();

                // Auto hide toast after 6 seconds
                setTimeout(() => {
                    closeToast();
                }, 6000);

            }, 1200);
        });

        // Remove red border error on input interaction
        const formInputs = bookingForm.querySelectorAll('input, select');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('border-red-500');
                input.classList.add('border-borderSlate');
            });
        });
    }

    function closeToast() {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
    }

    if (toastClose) {
        toastClose.addEventListener('click', closeToast);
    }


    // 6. Scroll Reveal Animations (using Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-reveal');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active-reveal'));
    }
});
