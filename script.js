let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    updateCartCount();
    displayCart();
});

function loadProducts() {
    products = [
        {"id":1,"name":"Vitamin C Serum","price":29.99,"baseImg":"vitamin c"},
        {"id":2,"name":"Hydrating Moisturizer","price":19.99,"baseImg":"Hydrating mositurizer"},
        {"id":3,"name":"Gentle Face Wash","price":12.99,"baseImg":"facewash"},
        {"id":4,"name":"Sunscreen SPF50","price":24.99,"baseImg":"sunscreen"},
        {"id":5,"name":"Exfoliating Body Wash","price":15.99,"baseImg":"bodywash"},
        {"id":6,"name":"Sugar Face Scrub","price":18.99,"baseImg":"sugarscrub"},
        {"id":7,"name":"Matte Lipstick","price":14.99,"baseImg":"lipstick"},
        {"id":8,"name":"Long-Lasting Kajal","price":9.99,"baseImg":"kajal"},
        {"id":9,"name":"Volume Mascara","price":16.99,"baseImg":"mascra"},
        {"id":10,"name":"Liquid Lipliner","price":11.99,"baseImg":"liquid lipliner"},
        {"id":11,"name":"Cream Blush","price":13.99,"baseImg":"cream blush"},
        {"id":12,"name":"Liquid Foundation","price":22.99,"baseImg":"foundation"},
        {"id":13,"name":"Full Coverage Concealer","price":17.99,"baseImg":"concelear"},
        {"id":14,"name":"Hydrating Toner","price":20.99,"baseImg":"hydrating toner"},
        {"id":15,"name":"Gel Eyeliner","price":19.99,"baseImg":"eye liner"},
        {"id":16,"name":"Pore-Blurring Primer","price":25.99,"baseImg":"primer"},
        {"id":17,"name":"Eyeshadow Palette","price":28.99,"baseImg":"eyepalete"}
    ];
    displayProducts();
}

function getImageUrl(baseName) {
    // Try JPG first, then JPEG, then PNG, then placeholder
    return `images/${baseName}.jpg`;
}

function displayProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => {
        const imgUrl = getImageUrl(p.baseImg);
        return `
        <div class="product" data-id="${p.id}">
            <img src="${imgUrl}" 
                 onerror="this.src='images/${p.baseImg}.jpeg'; 
                         this.onerror=function(){this.src='https://via.placeholder.com/280x250/ff69b4/fff?text=${p.name.replace(/\\s+/g, '+')}';}" 
                 alt="${p.name}" loading="lazy">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>$${p.price}</p>
                <div class="product-controls">
                    <button class="qty-btn minus" data-id="${p.id}">-</button>
                    <span class="qty-display" data-id="${p.id}">${cart.find(c => c.id === p.id)?.qty || 0}</span>
                    <button class="qty-btn plus" data-id="${p.id}">+</button>
                    <button class="add-cart-btn" data-id="${p.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    addProductEventListeners();
}

function addProductEventListeners() {
    // Event delegation - better performance
    document.getElementById('product-list').addEventListener('click', function(e) {
        if (e.target.classList.contains('plus')) {
            const id = parseInt(e.target.dataset.id);
            changeQty(id, 1);
        } else if (e.target.classList.contains('minus')) {
            const id = parseInt(e.target.dataset.id);
            changeQty(id, -1);
        } else if (e.target.classList.contains('add-cart-btn') || e.target.closest('.add-cart-btn')) {
            const id = parseInt(e.target.closest('.add-cart-btn').dataset.id);
            addAndGoToCart(id);
        }
    });
}

function addAndGoToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    openCart();
    updateCartCount();
    displayProducts();
}

function changeQty(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(c => c.id !== id);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayProducts();
        displayCart();
        updateCartCount();
    } else if (delta === 1) {
        addAndGoToCart(id);
    }
}

function openCart() {
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function displayCart() {
    const cartEl = document.getElementById('cart-items');
    if (cart.length === 0) {
        cartEl.innerHTML = '<p style="text-align:center;color:#999;">Your cart is empty</p>';
        document.getElementById('total-amount').textContent = '0';
        return;
    }
    
    cartEl.innerHTML = cart.map(item => {
        const imgUrl = getImageUrl(item.baseImg);
        return `
        <div class="cart-item">
            <img src="${imgUrl}" 
                 onerror="this.src='images/${item.baseImg}.jpeg'; 
                         this.onerror=function(){this.src='https://via.placeholder.com/60x60/ff69b4/fff?text=${item.name.charAt(0)}';}" 
                 alt="${item.name}" style="width:60px;height:60px;border-radius:8px;object-fit:cover;">
            <div style="flex:1;">
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.qty} = $${(item.price * item.qty).toFixed(2)}</p>
            </div>
            <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
        `;
    }).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('total-amount').textContent = total.toFixed(2);
    
    // Cart remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            changeQty(id, -1);
        };
    });
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = count || 0;
}

function setupEventListeners() {
    document.getElementById('burger').onclick = () => {
        document.getElementById('nav-list').classList.toggle('active');
    };
    
    if (document.getElementById('cart-link')) {
        document.getElementById('cart-link').onclick = openCart;
    }
    
    document.getElementById('close-cart').onclick = () => {
        document.getElementById('cart-sidebar').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    };
    
    document.getElementById('overlay').onclick = () => {
        document.getElementById('cart-sidebar').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    };
    
    document.getElementById('buy-now').onclick = () => {
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        document.getElementById('cart-sidebar').classList.remove('active');
        document.getElementById('form-modal').classList.add('active');
    };
    
    if (document.getElementById('checkout-form')) {
        document.getElementById('checkout-form').onsubmit = (e) => {
            e.preventDefault();
            alert('Order placed successfully! Thank you for shopping with BeautyHub.');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            document.getElementById('form-modal').classList.remove('active');
            displayCart();
            displayProducts();
            updateCartCount();
        };
    }
    
    if (document.querySelector('.contact-form')) {
        document.querySelector('.contact-form').onsubmit = (e) => {
            e.preventDefault();
            alert('Thank you! Your message has been sent to support@beautyhub.com');
            e.target.reset();
        };
    }
}
