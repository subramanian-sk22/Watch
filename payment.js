// Payment page functionality

(function() {
    // Sample cart data (in production, this would come from localStorage or backend)
    let cart = [
        { id: 1, name: 'Elegant Rainbow Watch', price: 1299, quantity: 1 },
        { id: 2, name: 'Classic Diamond Watch', price: 2599, quantity: 1 },
        { id: 3, name: 'Stylish Men Watch', price: 3499, quantity: 1 },
        { id: 4, name: 'Premium Gold Edition', price: 4999, quantity: 1 }
    ];

    // Load cart from localStorage if available
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Calculate totals
    function calculateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = Math.round(subtotal * 0.18);
        const shipping = subtotal > 5000 ? 0 : 100; // Free shipping above 5000
        const total = subtotal + tax + shipping;

        return { subtotal, tax, shipping, total };
    }

    // Render cart items
    function renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="test.html#products" style="color: #fbbf24; text-decoration: none;">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toLocaleString()}</p>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn qty-decrease" data-index="${index}">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn qty-increase" data-index="${index}">+</button>
                </div>
                <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Add event listeners to quantity and remove buttons
        document.querySelectorAll('.qty-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cart[index].quantity++;
                saveCart();
                renderCart();
                updateTotals();
            });
        });

        document.querySelectorAll('.qty-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                saveCart();
                renderCart();
                updateTotals();
            });
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cart.splice(index, 1);
                saveCart();
                renderCart();
                updateTotals();
            });
        });
    }

    // Update total amounts
    function updateTotals() {
        const { subtotal, tax, shipping, total } = calculateTotals();

        document.getElementById('subtotal').textContent = '₹' + subtotal.toLocaleString();
        document.getElementById('tax').textContent = '₹' + tax.toLocaleString();
        document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : '₹' + shipping.toLocaleString();
        document.getElementById('total-amount').textContent = '₹' + total.toLocaleString();
    }

    // Handle payment method changes
    function handlePaymentMethodChange() {
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const cardDetails = document.getElementById('card-details');
        const upiDetails = document.getElementById('upi-details');

        cardDetails.classList.toggle('hidden', paymentMethod !== 'card');
        upiDetails.classList.toggle('hidden', paymentMethod !== 'upi');

        // Clear required attribute based on method
        const cardInputs = cardDetails.querySelectorAll('input');
        const upiInputs = upiDetails.querySelectorAll('input');

        cardInputs.forEach(input => input.required = paymentMethod === 'card');
        upiInputs.forEach(input => input.required = paymentMethod === 'upi');
    }

    // Format card number input
    function formatCardNumber(value) {
        return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiry input
    function formatExpiry(value) {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const formData = new FormData(document.getElementById('payment-form'));
        const data = Object.fromEntries(formData);

        console.log('Order placed:', {
            items: cart,
            customer: data,
            totals: calculateTotals()
        });

        // Show success message
        alert(`Thank you for your order!\nTotal Amount: ₹${calculateTotals().total.toLocaleString()}\n\nWe'll send you a confirmation email shortly.`);

        // Clear cart and redirect
        localStorage.removeItem('cart');
        setTimeout(() => {
            window.location.href = 'test.html';
        }, 2000);
    }

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', () => {
        loadCart();
        renderCart();
        updateTotals();

        // Payment method change handler
        document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
            radio.addEventListener('change', handlePaymentMethodChange);
        });
        handlePaymentMethodChange();

        // Card number formatting
        const cardNumber = document.getElementById('card-number');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                e.target.value = formatCardNumber(e.target.value);
            });
        }

        // Expiry formatting
        const cardExpiry = document.getElementById('card-expiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                e.target.value = formatExpiry(e.target.value);
            });
        }

        // Form submission
        document.getElementById('payment-form').addEventListener('submit', handleFormSubmit);

        // Smooth scroll for links
        document.querySelectorAll('a[href^="test.html"]').forEach(link => {
            link.addEventListener('click', function(e) {
                // Allow normal navigation
            });
        });
    });

    // Expose helper functions
    window.paymentHelpers = {
        addToCart: (name, price) => {
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({
                    id: cart.length + 1,
                    name,
                    price,
                    quantity: 1
                });
            }
            saveCart();
            renderCart();
            updateTotals();
        },
        getCart: () => cart,
        clearCart: () => {
            cart = [];
            saveCart();
            renderCart();
            updateTotals();
        }
    };

})();
