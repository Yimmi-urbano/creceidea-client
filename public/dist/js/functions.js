// functions.js
import { getDataAttributes, addToCart, getCartItemCount, showModal, closeModal, getCartItems, incrementQty, decrementQty } from './utils.js';

const cantidadCartDiv = document.querySelector('.count-products');

const updateCartItemCount = () => {
    const itemCount = getCartItemCount();
    if (cantidadCartDiv) {
        cantidadCartDiv.textContent = itemCount;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add_to_cart');
    const quantityInput = document.querySelector('#quantity');


    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const data = getDataAttributes(button);
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            addToCart(data, quantity);
            updateCartItemCount();
        });
    });

    updateCartItemCount();


});

const renderCartItems = () => {
    const cart = getCartItems();
    if (!cart) return "<p>No items in the cart.</p>";

    const { items_cart, Total, currency, cantItems } = cart;
    let content = `<p><strong>Total Items:</strong> ${cantItems}</p>`;
    content += `<p><strong>Total Price:</strong> ${currency} ${Total}</p>`;
    content += '<ul>';

    items_cart.forEach(item => {
        content += `
            <li class="mb-2 border-b pb-2">
                <img src="${item.image}" alt="${item.title}" class="w-12 h-12 rounded inline-block mr-2">
                <span><strong>${item.title}</strong></span>
                <p>Price: ${currency} ${item.price_sale || item.price_regular}</p>
                <div class="mt-2">
                    <button data-action="decrement" data-id="${item.id}" class="px-2 py-1 bg-gray-300 rounded">-</button>
                    <input type="number" id="qty-${item.id}" value="${item.qty}" min="1" class="w-12 text-center border mx-1" onchange="updateProductQty('${item.id}', this.value)">
                    <button data-action="increment" data-id="${item.id}" class="px-2 py-1 bg-gray-300 rounded">+</button>
                </div>
            </li>
        `;
    });

    content += '</ul>';
    return content;
};

const updateCartModalContent = () => {
    const modalBody = document.querySelector('.modal-body');
    updateCartItemCount()
    if (modalBody) {
        modalBody.innerHTML = renderCartItems();
    }
};
document.addEventListener('DOMContentLoaded', () => {
    const openCart = document.querySelector('#openCart');
    const modalBody = document.querySelector('.modal-body');

    const openCartModal = () => {
        showModal({
            title: "Lista de pedido",
            content: renderCartItems(),
            iconHTML: `<svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`,
            onConfirm: () => {
                console.log("Checkout process started");
                closeModal();
            }
        });
    };

    openCart.addEventListener('click', openCartModal);

    // Delegación de eventos para botones de incremento/decremento en el modal
    modalBody.addEventListener('click', (event) => {
        const target = event.target;
        const action = target.getAttribute('data-action');
        const id = target.getAttribute('data-id');

        if (action === 'increment') {
            incrementQty(id);
            updateCartModalContent()
        } else if (action === 'decrement') {
            decrementQty(id);
            updateCartModalContent()
        }
    });
});