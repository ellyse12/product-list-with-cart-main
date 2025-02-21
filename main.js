const desserts = [
    { id: 1, category: "Waffle with Berries", name: "Waffle", price: 6.50, image: "/assets/images/image-waffle-desktop.jpg" },
    { id: 2, category: "Vanilla Bean Crème Brûlée", name: "Crème Brûlée", price: 7.00, image: "/assets/images/image-creme-brulee-desktop.jpg" },
    { id: 3, category: "Macaron Mix of Five", name: "Macaron", price: 8.00, image: "/assets/images/image-macaron-desktop.jpg" },
    { id: 4, category: "Classic Tiramisu", name: "Tiramisu", price: 5.50, image: "/assets/images/image-tiramisu-desktop.jpg" },
    { id: 5, category: "Pistachio Baklava", name: "Baklava", price: 4.00, image: "/assets/images/image-baklava-desktop.jpg" },
    { id: 6, category: "Lemon Meringue Pie", name: "Pie", price: 5.00, image: "/assets/images/image-meringue-desktop.jpg" },
    { id: 7, category: "Red Velvet Cake", name: "Cake", price: 4.50, image: "/assets/images/image-cake-desktop.jpg" },
    { id: 8, category: "Salted Caramel Brownie", name: "Brownie", price: 5.50, image: "/assets/images/image-brownie-desktop.jpg" },
    { id: 9, category: "Vanilla Panna Cotta", name: "Panna Cotta", price: 6.50, image: "/assets/images/image-panna-cotta-desktop.jpg" }
];

const cart = {
    items: new Map(),

    addItem(dessert) {
        const quantity = this.items.get(dessert.id)?.quantity || 0;
        this.items.set(dessert.id, {
            dessert,
            quantity: quantity + 1
        });
        this.updateUI();
    },

    removeItem(dessertId) {
        const item = this.items.get(dessertId);
        if (item && item.quantity > 1) {
            item.quantity--;
        } else {
            this.items.delete(dessertId);
        }
        this.updateUI();
    },

    getTotal() {
        let total = 0;
        for (const item of this.items.values()) {
            total += item.dessert.price * item.quantity;
        }
        return total;
    },

    clear() {
        this.items.clear();
        this.updateUI();
    },

    updateUI() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const orderTotal = document.getElementById('orderTotal');

        cartItems.innerHTML = '';
        let count = 0;

        for (const item of this.items.values()) {
            count += item.quantity;
            cartItems.appendChild(createCartItemElement(item));
        }

        cartCount.textContent = count;
        orderTotal.textContent = `$${this.getTotal().toFixed(2)}`;
    }
};

function createMenuItemElement(dessert) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
        <img src="${dessert.image}" alt="${dessert.name}" />
        <button class="add-to-cart-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 20C9 21.1 8.1 22 7 22C5.9 22 5 21.1 5 20C5 18.9 5.9 18 7 18C8.1 18 9 18.9 9 20Z"/>
                    <path d="M20 20C20 21.1 19.1 22 18 22C16.9 22 16 21.1 16 20C16 18.9 16.9 18 18 18C19.1 18 20 18.9 20 20Z"/>
                    <path d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17"/>
                </svg>
                Add to Cart
            </button>
        <div class="menu-item-content">
            <div class="menu-item-category">${dessert.category}</div>
            <h3 class="menu-item-title">${dessert.name}</h3>
            <div class="menu-item-price">$${dessert.price.toFixed(2)}</div>
            
        </div>
    `;

    div.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        cart.addItem(dessert);
    });

    return div;
}

function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <img src="${item.dessert.image}" alt="${item.dessert.name}" />
        <div class="cart-item-info">
            <h3>${item.dessert.name}</h3>
            <div class="cart-item-price">$${(item.dessert.price * item.quantity).toFixed(2)}</div>
        </div>
        <div class="quantity-controls">
            <button class="quantity-btn remove">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn add">+</button>
        </div>
    `;

    div.querySelector('.remove').addEventListener('click', () => {
        cart.removeItem(item.dessert.id);
    });

    div.querySelector('.add').addEventListener('click', () => {
        cart.addItem(item.dessert);
    });

    return div;
}

function showOrderConfirmation() {
    const modal = document.getElementById('orderConfirmed');
    const summary = document.getElementById('orderSummary');

    summary.innerHTML = `
        <div style="margin: 1.5rem 0;">
            ${Array.from(cart.items.values()).map(item => `
                <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
                    <span>${item.quantity}x ${item.dessert.name}</span>
                    <span>$${(item.dessert.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
            <div style="border-top: 1px solid #eee; margin-top: 1rem; padding-top: 1rem;">
                <strong>Order Total:</strong> $${cart.getTotal().toFixed(2)}
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

window.startNewOrder = function () {
    cart.clear();
    document.getElementById('orderConfirmed').style.display = 'none';
};

document.getElementById('confirmOrder').addEventListener('click', showOrderConfirmation);

const menuGrid = document.getElementById('menuGrid');
desserts.forEach(dessert => {
    menuGrid.appendChild(createMenuItemElement(dessert));
});