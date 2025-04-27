// User data (in a real app, this would come from a database or API)
const users = [
    { id: '1', name: 'Admin User', username: 'admin', password: 'admin123', role: 'admin' },
    { id: '2', name: 'Manager', username: 'manager', password: 'manager123', role: 'manager' },
    { id: '3', name: 'Cashier', username: 'cashier', password: 'cashier123', role: 'cashier' }
];

// DOM Elements
const authModal = document.getElementById('auth-modal');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const currentUserElement = document.getElementById('current-user');

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    // If we're on the dashboard page, check authentication
    if (window.location.pathname.includes('Dashboard.html')) {
        checkAuthentication();
    } else {
        // On login page, initialize auth modal
        initAuthModal();
    }
});

// Initialize authentication modal
function initAuthModal() {
    // Show login form when login tab is clicked
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        clearAuthErrors();
    });

    // Show signup form when signup tab is clicked
    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
        clearAuthErrors();
    });

    // Login form submission
    loginForm.addEventListener('submit', handleLogin);

    // Signup form submission
    signupForm.addEventListener('submit', handleSignup);

    // Show auth modal by default on login page
    showAuthModal();
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    clearAuthErrors();
    
    // Basic validation
    if (!username || !password) {
        showAuthError('Please enter both username and password', loginForm);
        return;
    }

    // Validate credentials
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Successful login
        setUserSession(user);
        redirectToDashboard();
    } else {
        showAuthError('Invalid username or password', loginForm);
    }
}

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;
    
    clearAuthErrors();
    
    // Validation
    if (!name || !username || !password) {
        showAuthError('Please fill all fields', signupForm);
        return;
    }

    if (users.some(u => u.username === username)) {
        showAuthError('Username already exists', signupForm);
        return;
    }
    
    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters', signupForm);
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        username,
        password,
        role
    };
    
    // In a real app, you would send this to your backend
    users.push(newUser);
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = 'Account created successfully! Please login.';
    signupForm.appendChild(successMsg);
    
    // Switch to login tab after a delay
    setTimeout(() => {
        successMsg.remove();
        loginTab.click();
        document.getElementById('login-username').value = username;
        document.getElementById('login-password').value = '';
    }, 2000);
}

// Check authentication status (for dashboard page)
function checkAuthentication() {
    const user = getUserSession();
    
    if (!user) {
        // Redirect to login page if not authenticated
        window.location.href = 'index.html';
        return;
    }
    
    // Update UI with user info
    if (currentUserElement) {
        currentUserElement.textContent = `${user.name} (${user.role})`;
    }
    
    // Setup logout button if it exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Apply role-based restrictions
    applyRoleRestrictions(user.role);
    
    // Initialize other dashboard functionality
    initializeDashboard();
}

// Handle logout
function handleLogout() {
    clearUserSession();
    window.location.href = 'index.html';
}

// Session management functions
function setUserSession(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function getUserSession() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function clearUserSession() {
    sessionStorage.removeItem('currentUser');
}

// Navigation functions
function redirectToDashboard() {
    window.location.href = 'Dashboard.html';
}

function showAuthModal() {
    if (authModal) {
        authModal.style.display = 'flex';
        clearAuthErrors();
        loginForm.reset();
        signupForm.reset();
    }
}

// UI Helper functions
function showAuthError(message, form) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    form.appendChild(errorMsg);
}

function clearAuthErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

// Role-based restrictions
function applyRoleRestrictions(role) {
    // Example: Hide admin features for non-admin users
    if (role !== 'admin') {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => el.style.display = 'none');
    }
    
    if (role === 'cashier') {
        const managerElements = document.querySelectorAll('.manager-only');
        managerElements.forEach(el => el.style.display = 'none');
    }
}

// Dashboard initialization
function initializeDashboard() {
    // Initialize date display
    updateCurrentDate();
    
    // Initialize any other dashboard components
    // displayProducts();
    // setupCategoryFilter();
    // etc.
}

function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}