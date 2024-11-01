// utils.js

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

const showModal = ({ title, content, iconHTML, onConfirm }) => {
    const modal = document.getElementById("custom-modal");
    const modalTitle = modal.querySelector(".modal-title");
    const modalBody = modal.querySelector(".modal-body");
    const iconContainer = modal.querySelector(".icon-container");
    const confirmButton = document.getElementById("modal-confirm-btn");

    // Actualizar el contenido dinámico
    modalTitle.textContent = title;
    
    iconContainer.innerHTML = iconHTML;

    // Mostrar el modal
    modal.classList.remove("hidden");

    // Asignar el evento al botón de confirmación
    confirmButton.onclick = onConfirm;
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



export { getDataAttributes, addToCart, getCartItemCount, showModal, closeModal, getCartItems, incrementQty, decrementQty, updateSessionStorageCart, calculateCartSummary };
