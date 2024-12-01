const getDataAttributes = (element) => {
    const dataAttributes = {};
    Array.from(element.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
            const key = attr.name.slice(5).replace(/-./g, x => x[1].toUpperCase());
            dataAttributes[key] = isNaN(attr.value) ? attr.value : parseFloat(attr.value);
        }
    });
    return dataAttributes;
};

const updateSessionStorageCart = (cart) => {
    sessionStorage.setItem('cart_tem', JSON.stringify(cart));
};

const calculateCartSummary = (items_cart) => {
    let total = 0;
    let cantItems = 0;
    items_cart.forEach(item => {
        const priceSale = parseFloat(item.price_sale);
        const priceRegular = parseFloat(item.price_regular);
        const price = (priceSale > 0 && priceSale < priceRegular) ? priceSale : priceRegular;
        total += price * item.qty;
        cantItems += item.qty;
    });
    return { total: parseFloat(total.toFixed(2)), cantItems };
};

const addToCart = (item, quantity = 1) => {
    let cart = JSON.parse(sessionStorage.getItem('cart_tem')) || { items_cart: [], Total: 0.0, currency: "PEN", cantItems: 0 };
    let items_cart = cart.items_cart;

    const existingProductIndex = items_cart.findIndex(product => product.id === item.id);

    if (existingProductIndex !== -1) {
        items_cart[existingProductIndex].qty += quantity;
    } else {
        item.qty = quantity;
        items_cart.push(item);
    }

    const { total, cantItems } = calculateCartSummary(items_cart);
    cart.Total = total;
    cart.cantItems = cantItems;
    cart.items_cart = items_cart;

    updateSessionStorageCart(cart);
};

const getCartItemCount = () => {
    const cart = JSON.parse(sessionStorage.getItem('cart_tem'));
    return cart ? cart.cantItems : 0;
};

const showModal = ({ title, content, iconHTML, onConfirm, onClosed }) => {
    const modal = document.getElementById("custom-modal");
    const modalTitle = modal.querySelector(".modal-title");
    const modalBody = modal.querySelector(".modal-body");
    const iconContainer = modal.querySelector(".icon-container");
    const confirmButton = document.getElementById("modal-confirm-btn");
    const closedModal = document.getElementById("modal-cancel-btn");


    modalTitle.textContent = title;
    iconContainer.innerHTML = iconHTML;

    modal.classList.remove("hidden");

    confirmButton.onclick = onConfirm;
    closedModal.onclick = onClosed;
};

const closeModal = () => {
    const modal = document.getElementById("custom-modal");
    modal.classList.add("hidden");
};

const getCartItems = () => {
    const cartData = sessionStorage.getItem("cart_tem");
    if (!cartData) return null;

    try {
        return JSON.parse(cartData);
    } catch (error) {
        console.error("Error parsing cart data:", error);
        return null;
    }
};

const incrementQty = (id) => {
    const cart = getCartItems();
    const product = cart.items_cart.find(item => item.id === id);
    if (product) {
        product.qty += 1;
        const { total, cantItems } = calculateCartSummary(cart.items_cart);
        cart.Total = total;
        cart.cantItems = cantItems;
        updateSessionStorageCart(cart);

    }
};

const decrementQty = (id) => {
    const cart = getCartItems();
    const product = cart.items_cart.find(item => item.id === id);
    if (product && product.qty > 1) {
        product.qty -= 1;
        const { total, cantItems } = calculateCartSummary(cart.items_cart);
        cart.Total = total;
        cart.cantItems = cantItems;
        updateSessionStorageCart(cart);

    }
};

export const showNotification = (productName, productImageUrl) => {
    const notification = document.getElementById('notification');
    const message = document.getElementById('notification-message');
    const image = document.getElementById('notification-image');
    const openCartButton = document.getElementById('open-cart-btn');

    message.textContent = `${productName}`;
    image.src = productImageUrl;
    notification.classList.remove('hidden');
    notification.classList.remove('translate-y-20', 'opacity-0');
    notification.classList.add('translate-y-0', 'opacity-100');

    document.querySelector('#open-cart-btn').addEventListener('click', () => {
        document.getElementById('openCart').click();
    });

    setTimeout(() => {
        notification.classList.add('translate-y-20', 'opacity-0');
        notification.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
};

export function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function validateForm() {
    const form = document.getElementById("orderForm");

    const dni = form.querySelector("input[name='doc']");
    const name = form.querySelector("input[name='nom']");
    const email = form.querySelector("input[name='email']");
    const phone = form.querySelector("input[name='celular']");

    const isDniValid = /^[0-9]{8,}$/.test(dni.value.trim());
    const isNameValid = name.value.trim().length >= 3;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const isPhoneValid = /^[0-9]{9,}$/.test(phone.value.trim());

    const allValid = isDniValid && isNameValid && isEmailValid && isPhoneValid;
    document.getElementById("send-order-end").disabled = !allValid;
}

export function initializeValidation() {
    const form = document.getElementById("orderForm");
    const inputs = form.querySelectorAll("input[name='doc'], input[name='nom'], input[name='email'], input[name='celular']");
    inputs.forEach(input => input.addEventListener("input", validateForm));
}

export function getOrderData() {

    const form = document.getElementById("orderForm");
    const clientInfo = {
        doc: form.querySelector("input[name='doc']").value,
        name: form.querySelector("input[name='nom']").value,
        email: form.querySelector("input[name='email']").value,
        phone: form.querySelector("input[name='celular']").value,
    };

    const billingInfo = { ...clientInfo };
    const shippingInfo = { ...clientInfo };

    const orderData = {
        clientInfo,
        billingInfo,
        shippingInfo,
    };

    return orderData;
}

export function loaderProcess(status) {


    const showModalLoader = document.getElementById("loader");

    if (status) {
        showModalLoader.classList.remove("hidden");
    }else{
        showModalLoader.classList.add("hidden");

    }

   


    
}

export { getDataAttributes, addToCart, getCartItemCount, showModal, closeModal, getCartItems, incrementQty, decrementQty, updateSessionStorageCart, calculateCartSummary };
