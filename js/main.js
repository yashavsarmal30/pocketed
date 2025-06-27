document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selections ---
    const pages = document.querySelectorAll('.page-section');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const mobileMenu = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('main-nav');
    const header = document.querySelector('header');
    
    // --- Keep only the main navbar sticky, not section headers ---
    const sectionHeaders = document.querySelectorAll('#courses-page header, #blog-page header, #community-page header');
    sectionHeaders.forEach(sectionHeader => {
        sectionHeader.style.position = 'relative';
        sectionHeader.style.top = 'auto';
        sectionHeader.style.zIndex = 'auto';
    });

    // --- Core Navigation and Page Switching ---
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) {
            pageToShow.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
        updateActiveNavForPage(pageId);
    };

    function handleNavClick(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        if (!href) return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetId.includes('-page')) {
            showPage(targetId);
        } else if (targetElement && document.getElementById('home-page').classList.contains('active')) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        } else {
            showPage('home-page');
            setTimeout(() => {
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }

        if (mobileMenu) mobileMenu.classList.add('hidden');
    };

    allNavLinks.forEach(link => link.addEventListener('click', handleNavClick));

    document.getElementById('mobile-menu-button')?.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                mainNav.querySelectorAll('.nav-link').forEach(link => {
                    const linkHref = link.getAttribute('href').substring(1);
                    link.classList.toggle('active-nav', linkHref === sectionId);
                });
            }
        });
    }, {
        rootMargin: "-40% 0px -60% 0px"
    });

    document.querySelectorAll('#home-page .nav-section').forEach(section => {
        navObserver.observe(section);
    });
    
    function updateActiveNavForPage(pageId) {
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            const linkHref = link.getAttribute('href').substring(1);
            link.classList.toggle('active-nav', linkHref === pageId);
        });
    }

    // --- FORM LOGIC ---
    async function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if (typeof form.successCallback === 'function') {
                    form.successCallback();
                }
                form.reset();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || 'Could not submit form.'}`);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Oops! There was a problem submitting your form.');
        }
    }
    
    const enrollmentForm = document.getElementById('enrollment-form');
    if (enrollmentForm) {
        enrollmentForm.successCallback = () => {
             alert('Thank you! Your inquiry has been received. We will be in touch shortly.');
        };
        enrollmentForm.addEventListener("submit", handleFormSubmit);
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if(newsletterForm) {
        newsletterForm.successCallback = () => {
            const feedbackEl = document.getElementById('newsletter-feedback');
            if(feedbackEl) {
                feedbackEl.textContent = 'Thank you for subscribing!';
                setTimeout(() => { feedbackEl.textContent = ''; }, 3000);
            }
        };
        newsletterForm.addEventListener("submit", handleFormSubmit);
    }

    const popupForm = document.getElementById('popup-newsletter-form');
    if(popupForm) {
        popupForm.successCallback = () => {
            hideNewsletterPopup();
            alert('Thank you for subscribing!');
        };
        popupForm.addEventListener("submit", handleFormSubmit);
    }

    const roleSelector = document.getElementById('role-selector');
    if (roleSelector) {
        const formFieldsContainer = document.getElementById('form-fields');
        const formTemplates = {
            student: `<input type="hidden" name="role" value="Student"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block mb-1 font-semibold">Full Name</label><input type="text" name="full-name" placeholder="Your Name" class="w-full p-3 border rounded-lg" required></div><div><label class="block mb-1 font-semibold">Age</label><input type="number" name="age" placeholder="14" class="w-full p-3 border rounded-lg" required></div></div><div class="mt-4"><label class="block mb-1 font-semibold">Email Address</label><input type="email" name="email" placeholder="you@example.com" class="w-full p-3 border rounded-lg" required></div><div class="mt-4"><label class="block mb-1 font-semibold">Phone Number</label><input type="tel" name="phone" placeholder="+91..." class="w-full p-3 border rounded-lg"></div>`,
            parent: `<input type="hidden" name="role" value="Parent"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block mb-1 font-semibold">Parent's Name</label><input type="text" name="parent-name" placeholder="Parent's Full Name" class="w-full p-3 border rounded-lg" required></div><div><label class="block mb-1 font-semibold">Student's Name</label><input type="text" name="student-name" placeholder="Student's Full Name" class="w-full p-3 border rounded-lg" required></div></div><div class="mt-4"><label class="block mb-1 font-semibold">Email Address</label><input type="email" name="email" placeholder="you@example.com" class="w-full p-3 border rounded-lg" required></div><div class="mt-4"><label class="block mb-1 font-semibold">Phone Number</label><input type="tel" name="phone" placeholder="+91..." class="w-full p-3 border rounded-lg"></div>`,
            school: `<input type="hidden" name="role" value="School"><div><label class="block mb-1 font-semibold">School Name</label><input type="text" name="school-name" placeholder="e.g. Delhi Public School" class="w-full p-3 border rounded-lg" required></div><div class="mt-4"><label class="block mb-1 font-semibold">Contact Person</label><input type="text" name="contact-person" placeholder="Name of Principal/Coordinator" class="w-full p-3 border rounded-lg" required></div><div class="mt-4"><label class="block mb-1 font-semibold">Official Email</label><input type="email" name="email" placeholder="contact@school.edu" class="w-full p-3 border rounded-lg" required></div><div class="mt-4"><label class="block mb-1 font-semibold">Contact Number</label><input type="tel" name="phone" placeholder="+91..." class="w-full p-3 border rounded-lg"></div>`
        };
        const updateForm = (role) => {
            if (formFieldsContainer) formFieldsContainer.innerHTML = formTemplates[role];
            roleSelector.querySelectorAll('.role-btn').forEach(button => {
                button.classList.toggle('bg-brand-blue', button.dataset.role === role);
                button.classList.toggle('text-white', button.dataset.role === role);
                button.classList.toggle('bg-gray-200', button.dataset.role !== role);
                button.classList.toggle('text-gray-800', button.dataset.role !== role);
            });
        };
        roleSelector.addEventListener('click', (e) => {
            if (e.target.matches('.role-btn')) updateForm(e.target.dataset.role);
        });
        updateForm('student');
    }

    // --- INTERACTIVE COMPONENTS ---
    const newsletterModal = document.getElementById('newsletter-modal');
    const closeNewsletterBtn = document.getElementById('close-newsletter-btn');
    const joinNewsletterBtn = document.getElementById('join-newsletter-btn');
    
    const showNewsletterPopup = () => {
        if (!sessionStorage.getItem('pocketed_newsletter_seen')) {
            newsletterModal?.classList.add('visible');
        }
    };
    const hideNewsletterPopup = () => {
        newsletterModal?.classList.remove('visible');
        sessionStorage.setItem('pocketed_newsletter_seen', 'true');
    };
    setTimeout(showNewsletterPopup, 5000);
    closeNewsletterBtn?.addEventListener('click', hideNewsletterPopup);
    joinNewsletterBtn?.addEventListener('click', () => {
         newsletterModal?.classList.add('visible');
         sessionStorage.removeItem('pocketed_newsletter_seen'); 
    });
    newsletterModal?.addEventListener('click', (e) => {
        if (e.target === newsletterModal) hideNewsletterPopup();
    });
    
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    const closeModalBtn = document.getElementById('close-modal-btn');
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', () => {
            const videoId = button.dataset.videoId;
            if (videoId && videoIframe) {
                videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                videoModal.classList.add('visible');
            }
        });
    });
    const closeModal = () => {
        if (videoIframe) videoIframe.src = '';
        videoModal.classList.remove('visible');
    };
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (videoModal) videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeModal();
    });

    document.querySelectorAll('.expand-journey-btn').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.roadmap-content').classList.toggle('expanded');
        });
    });
    
    function setupCarousel(carouselId, prevBtnId, nextBtnId) {
        const carousel = document.getElementById(carouselId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!carousel || !prevBtn || !nextBtn) return;

        const scroll = (direction) => {
            const slide = carousel.querySelector('.snap-center') || carousel.firstElementChild;
            if(slide) {
                let scrollAmount = slide.clientWidth;
                const slideStyle = window.getComputedStyle(slide);
                scrollAmount += parseFloat(slideStyle.marginRight);
                carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
            }
        };

        nextBtn.addEventListener('click', () => scroll(1));
        prevBtn.addEventListener('click', () => scroll(-1));
    }
    setupCarousel('testimonial-carousel', 'prev-btn', 'next-btn');
    setupCarousel('community-carousel', 'community-prev-btn', 'community-next-btn');

    const faqContainer = document.getElementById('faq-container');
    if (faqContainer) {
        const faqItems = faqContainer.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const wasActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!wasActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // --- ANIMATED COUNTER AND REVEAL ON SCROLL ---
    function animateCountUp(el) {
        const target = parseInt(el.dataset.target, 10);
        let current = 0;
        const duration = 1500;
        const frameDuration = 16;
        const totalFrames = duration / frameDuration;
        const increment = target / totalFrames;
        
        const updateCount = () => {
            current += increment;
            if (current < target) {
                el.innerText = Math.ceil(current) + '%';
                requestAnimationFrame(updateCount);
            } else {
                el.innerText = target + '%';
            }
        };
        requestAnimationFrame(updateCount);
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // JS FIX: This now finds ALL counters in the revealed section and animates them.
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    if (!counter.dataset.animated) {
                        animateCountUp(counter);
                        counter.dataset.animated = 'true';
                    }
                });
            }
        });
    }, { threshold: 0.1 }); 

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
    // Adjust scroll position for mobile to account for fixed header
    function adjustScrollForMobile() {
        if (window.innerWidth <= 768) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement && !targetId.includes('-page')) {
                        e.preventDefault();
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    }
    
    adjustScrollForMobile();
    window.addEventListener('resize', adjustScrollForMobile);
});