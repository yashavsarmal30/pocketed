document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle function
    window.toggleMobileMenu = function() {
        const mobileLinks = document.getElementById('myLinks');
        if (mobileLinks) {
            if (mobileLinks.classList.contains('hidden')) {
                mobileLinks.classList.remove('hidden');
            } else {
                mobileLinks.classList.add('hidden');
            }
        }
    };

    // Close mobile menu when a link is clicked
    const mobileNavLinks = document.querySelectorAll('#myLinks .nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobileLinks = document.getElementById('myLinks');
            if (mobileLinks) {
                mobileLinks.classList.add('hidden');
            }
        });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (event) => {
        const topNav = document.querySelector('.topnav');
        const mobileLinks = document.getElementById('myLinks');
        
        if (topNav && mobileLinks && !topNav.contains(event.target) && !mobileLinks.classList.contains('hidden')) {
            mobileLinks.classList.add('hidden');
        }
    });
}); 