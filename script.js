// Initialize EmailJS (Replace "YOUR_PUBLIC_KEY" with your actual key to activate)
if (typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_PUBLIC_KEY");
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // DOM Elements
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    /* ----------------------------------------------------------------
       THEME SWITCHER (Light / Dark Mode)
    ---------------------------------------------------------------- */
    // Check local storage or default to dark theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        body.className = 'dark-theme';
    }

    // Toggle theme handler
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('portfolio-theme', 'light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('portfolio-theme', 'dark-theme');
        }
    });

    /* ----------------------------------------------------------------
       NAVBAR SCROLL EFFECT & PROGRESS BAR
    ---------------------------------------------------------------- */
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Scroll Progress calculation
        if (documentHeight > 0) {
            const scrollPercent = (scrollY / documentHeight) * 100;
            scrollProgressBar.style.width = `${scrollPercent}%`;
        }

        // Navbar scrolled height/shadow effect
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to top button visibility
        if (scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    /* ----------------------------------------------------------------
       MOBILE NAVIGATION DRWAWER
    ---------------------------------------------------------------- */
    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile nav when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });

    /* ----------------------------------------------------------------
       SCROLL TO TOP ACTION
    ---------------------------------------------------------------- */
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ----------------------------------------------------------------
       INTERSECTION OBSERVER - SCROLL REVEAL & SKILLS PROGRESS ANIMATION
    ---------------------------------------------------------------- */
    // Setup skill bars for animation (reset widths to 0 first)
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillTargetWidths = new Map();

    skillBars.forEach(bar => {
        const currentWidth = bar.style.width;
        skillTargetWidths.set(bar, currentWidth);
        bar.style.width = '0%';
    });

    // Observer options
    const observerOptions = {
        root: null, // viewport
        threshold: 0.15, // 15% visible
        rootMargin: '0px 0px -50px 0px'
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it is a skills section card, animate the progress bars inside
                if (entry.target.classList.contains('skills-category-card')) {
                    const categoryBars = entry.target.querySelectorAll('.skill-bar-fill');
                    categoryBars.forEach(bar => {
                        if (skillTargetWidths.has(bar)) {
                            bar.style.width = skillTargetWidths.get(bar);
                        }
                    });
                }
                
                // Once animate is complete, unobserve if desired (we keep it for visual re-entry or disable for performance)
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, observerOptions);
    
    // Elements to reveal on scroll
    const revealElements = document.querySelectorAll('.scroll-reveal, .skills-category-card');
    revealElements.forEach(el => revealObserver.observe(el));

    /* ----------------------------------------------------------------
       INTERSECTION OBSERVER - ACTIVE SECTION HIGH-LIGHTER
    ---------------------------------------------------------------- */
    const sectionObserverOptions = {
        root: null,
        threshold: 0.35, // 35% visible in viewport
        rootMargin: '-80px 0px -20% 0px' // adjust for nav header height
    };

    const sectionCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Update active class on nav links
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Update active class on mobile nav links
                mobileNavLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const sectionObserver = new IntersectionObserver(sectionCallback, sectionObserverOptions);
    sections.forEach(sec => sectionObserver.observe(sec));

    /* ----------------------------------------------------------------
       PROJECTS FILTERING SYSTEM
    ---------------------------------------------------------------- */
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from other buttons, add to current
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Create a smooth fading filter transition
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    // Trigger a tiny reflow for css transition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // matches transition time
                }
            });
        });
    });

    /* ----------------------------------------------------------------
       CONTACT FORM SUBMISSION (Mocked)
    ---------------------------------------------------------------- */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitText = submitBtn.querySelector('span');
            const submitIcon = submitBtn.querySelector('.btn-submit-icon');
            
            // Collect Form Values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Form Validation (redundant check, input is required)
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            // Visual loading state
            submitBtn.disabled = true;
            submitText.innerText = 'Sending Message...';
            submitIcon.setAttribute('data-lucide', 'loader');
            lucide.createIcons(); // refresh icons list

            // EmailJS Integration preparation
            const emailjsParams = {
                from_name: name,
                reply_to: email,
                subject: subject,
                message: message,
                to_email: 'vaddeniranjan58@gmail.com'
            };

            // Check if EmailJS is initialized and active
            if (typeof emailjs !== 'undefined') {
                // To activate, make sure to initialize with your public key, then replace service/template ID:
                emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", emailjsParams)
                    .then(() => {
                        showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                        contactForm.reset();
                        
                        // Restore button state
                        submitBtn.disabled = false;
                        submitText.innerText = 'Send Message';
                        submitIcon.setAttribute('data-lucide', 'send');
                        lucide.createIcons();
                    })
                    .catch((error) => {
                        console.error('EmailJS Error:', error);
                        showFormMessage('Oops! EmailJS failed. Please try again or email directly.', 'error');
                        
                        // Restore button state
                        submitBtn.disabled = false;
                        submitText.innerText = 'Send Message';
                        submitIcon.setAttribute('data-lucide', 'send');
                        lucide.createIcons();
                    });
            } else {
                // Fallback simulation (if EmailJS not set up yet)
                setTimeout(() => {
                    showFormMessage('Thank you! Your message has been sent successfully (Mock Mode).', 'success');
                    contactForm.reset();
                    
                    // Restore button state
                    submitBtn.disabled = false;
                    submitText.innerText = 'Send Message';
                    submitIcon.setAttribute('data-lucide', 'send');
                    lucide.createIcons();
                }, 1500);
            }
        });
    }

    function showFormMessage(text, type) {
        formMessage.innerText = text;
        formMessage.className = `form-message ${type}`;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    /* ----------------------------------------------------------------
       NEWSLETTER FORM (Mocked)
    ---------------------------------------------------------------- */
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input');
            alert(`Successfully subscribed with: ${emailInput.value}!`);
            newsletterForm.reset();
        });
    }

    /* ----------------------------------------------------------------
       RESUME SECTION & MODAL FALLBACK
    ---------------------------------------------------------------- */
    const downloadResumeBtn = document.getElementById('downloadResumeBtn');
    const resumeStatusMsg = document.getElementById('resumeStatusMsg');
    const resumeModal = document.getElementById('resumeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    const openResumeModal = () => {
        resumeModal.classList.add('active');
        body.style.overflow = 'hidden';
    };

    const closeResumeModal = () => {
        resumeModal.classList.remove('active');
        body.style.overflow = '';
    };

    if (downloadResumeBtn) {
        fetch('resume.pdf', { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    setupResumeFallback();
                } else {
                    resumeStatusMsg.innerHTML = '<span class="status-available"><i data-lucide="check-circle" class="text-green"></i> resume.pdf is available on the server.</span>';
                    lucide.createIcons();
                }
            })
            .catch(() => {
                setupResumeFallback();
            });
    }

    function setupResumeFallback() {
        downloadResumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openResumeModal();
        });
        resumeStatusMsg.innerHTML = '<span class="status-missing"><i data-lucide="alert-circle" class="text-blue"></i> resume.pdf is missing. Click button to view placeholder resume.</span>';
        lucide.createIcons();
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeResumeModal);
    }

    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                closeResumeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
                closeResumeModal();
            }
        });
    }

    /* ----------------------------------------------------------------
       PREMIUM LOADER SCREEN
    ---------------------------------------------------------------- */
    const loaderWrapper = document.getElementById('loaderWrapper');
    if (loaderWrapper) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loaderWrapper.classList.add('fade-out');
            }, 1800); // 1.8s delay matching visual load bar
        });
    }

    /* ----------------------------------------------------------------
       MOUSE GLOW FOLLOW ACCENT
    ---------------------------------------------------------------- */
    const mouseGlow = document.getElementById('mouseGlow');
    if (mouseGlow) {
        document.addEventListener('mousemove', (e) => {
            mouseGlow.style.opacity = '1';
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });

        document.addEventListener('mouseleave', () => {
            mouseGlow.style.opacity = '0';
        });
    }

    /* ----------------------------------------------------------------
       HERO TYPEWRITER ANIMATION LOOP
    ---------------------------------------------------------------- */
    const words = ["Actionable Business Insights.", "Visual KPI Dashboards.", "Data-Driven Solutions."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;
    const erasingSpeed = 40;
    const newWordDelay = 2200;
    const typingElement = document.getElementById('typingElement');

    function type() {
        if (!typingElement) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, newWordDelay);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? erasingSpeed : typingSpeed);
        }
    }

    if (typingElement) {
        // Start typing slightly after loading screen finishes fading
        setTimeout(type, 2300);
    }
});
