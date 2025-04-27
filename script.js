// Sample product data
const products = [
    { id: '1', name: 'Laptop', price: 18999.99, category: 'Electronics', stock: 15, barcode: '123456789' },
    { id: '2', name: 'Smartphone', price: 13299.99, category: 'Electronics', stock: 30, barcode: '987654321' },
    { id: '3', name: 'Headphones', price: 2849.99, category: 'Electronics', stock: 45, barcode: '456123789' },
    { id: '4', name: 'T-Shirt', price: 379.99, category: 'Clothing', stock: 100, barcode: '789123456' },
    { id: '5', name: 'Jeans', price: 949.99, category: 'Clothing', stock: 60, barcode: '321654987' },
    { id: '6', name: 'Coffee Mug', price: 189.99, category: 'Home', stock: 80, barcode: '654987321' },
    { id: '7', name: 'Notebook', price: 94.99, category: 'Office', stock: 120, barcode: '159357486' },
    { id: '8', name: 'Desk Lamp', price: 474.99, category: 'Home', stock: 35, barcode: '753159486' },
];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const productSearch = document.getElementById('product-search');
const categoryFilter = document.getElementById('category-filter');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const holdSaleBtn = document.getElementById('hold-sale');
const currentDateElement = document.getElementById('current-date');

// Cart state
let cart = [];

// Initialize the app
function init() {
    displayProducts();
    setupCategoryFilter();
    setupEventListeners();
    updateCurrentDate();
}

// Display products in the grid
function displayProducts(filteredProducts = products) {
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <i class="fas fa-box-open fa-2x"></i>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">R${product.price.toFixed(2)}</div>
                <div class="product-stock">Stock: ${product.stock}</div>
            </div>
        `;
        
        productCard.addEventListener('click', () => addToCart(product));
        productGrid.appendChild(productCard);
    });
}

// Set up category filter dropdown
function setupCategoryFilter() {
    const categories = ['all', ...new Set(products.map(p => p.category))];
    
    categoryFilter.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category === 'all' ? 'All Categories' : category;
        categoryFilter.appendChild(option);
    });
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
}

// Update cart display
function updateCart() {
    cartItems.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R${item.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-quantity">
                <button class="decrement">-</button>
                <span>${item.quantity}</span>
                <button class="increment">+</button>
            </div>
            <div class="cart-item-total">R${itemTotal.toFixed(2)}</div>
            <div class="remove-item"><i class="fas fa-times"></i></div>
        `;
        
        // Add event listeners to quantity buttons
        const decrementBtn = cartItem.querySelector('.decrement');
        const incrementBtn = cartItem.querySelector('.increment');
        const removeBtn = cartItem.querySelector('.remove-item');
        
        decrementBtn.addEventListener('click', () => updateQuantity(item.id, -1));
        incrementBtn.addEventListener('click', () => updateQuantity(item.id, 1));
        removeBtn.addEventListener('click', () => removeItem(item.id));
        
        cartItems.appendChild(cartItem);
    });
    
    // Calculate totals
    const tax = subtotal * 0.15; // 15% VAT (South African standard)
    const total = subtotal + tax;
    
    subtotalElement.textContent = `R${subtotal.toFixed(2)}`;
    taxElement.textContent = `R${tax.toFixed(2)}`;
    totalElement.textContent = `R${total.toFixed(2)}`;
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity < 1) {
            cart = cart.filter(item => item.id !== productId);
        }
    }
    
    updateCart();
}

// Remove item from cart
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Clear cart
function clearCart() {
    cart = [];
    updateCart();
}

// Process checkout
function processCheckout() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    // In a real app, this would connect to a payment processor
    alert(`Sale completed! Total: R${totalElement.textContent}`);
    clearCart();
}

// Hold sale for later
function holdSale() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    // In a real app, this would save to a database
    alert('Sale has been held');
    clearCart();
}

// Filter products based on search and category
function filterProducts() {
    const searchTerm = productSearch.value.toLowerCase();
    const category = categoryFilter.value;
    
    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.barcode.includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
    });
    
    displayProducts(filtered);
}

// Update current date display
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-ZA', options);
}

// Set up event listeners
function setupEventListeners() {
    productSearch.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', processCheckout);
    holdSaleBtn.addEventListener('click', holdSale);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);