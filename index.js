// ... existing user data and currentUser variable ...

// DOM Elements
const landingPage = document.getElementById('landing-page');
const landingLoginBtn = document.getElementById('landing-login-btn');
const landingSignupBtn = document.getElementById('landing-signup-btn');
const heroSignupBtn = document.getElementById('hero-signup-btn');
const heroDemoBtn = document.getElementById('hero-demo-btn');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

// Show login modal from landing page buttons
landingLoginBtn.addEventListener('click', () => {
    showAuthModal();
    loginTab.click();
});

landingSignupBtn.addEventListener('click', () => {
    showAuthModal();
    signupTab.click();
});

heroSignupBtn.addEventListener('click', () => {
    showAuthModal();
    signupTab.click();
});

// Demo button shows POS with demo user
heroDemoBtn.addEventListener('click', () => {
    currentUser = {
        id: 'demo',
        name: 'Demo User',
        username: 'demo',
        role: 'cashier'
    };
    showPOSInterface();
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Show landing page by default
function showLandingPage() {
    landingPage.style.display = 'block';
    authModal.style.display = 'none';
    posInterface.style.display = 'none';
}

// Show auth modal (updated)
function showAuthModal() {
    landingPage.style.display = 'none';
    authModal.style.display = 'flex';
    posInterface.style.display = 'none';
    clearAuthErrors();
    loginForm.reset();
    signupForm.reset();
}

// Show POS interface (updated)
function showPOSInterface() {
    landingPage.style.display = 'none';
    authModal.style.display = 'none';
    posInterface.style.display = 'flex';
    currentUserElement.textContent = `${currentUser.name} (${currentUser.role})`;
    
    // Check user role to enable/disable features
    if (currentUser.role === 'cashier') {
        document.getElementById('hold-sale').style.display = 'none';
    }
}

// Initialize the app
function init() {
    // Show landing page first
    showLandingPage();
    
    // Initialize POS functionality
    displayProducts();
    setupCategoryFilter();
    setupEventListeners();
    updateCurrentDate();
}

// ... rest of your existing JavaScript ...

// Initialize the app
document.addEventListener('DOMContentLoaded', init);