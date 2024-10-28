// functions.js
import { getDataAttributes, addToCart, getCartItemCount } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add_to_cart');
    const cantidadCartDiv = document.querySelector('.count-products');
    const quantityInput = document.querySelector('#quantity');

    const updateCartItemCount = () => {
        const itemCount = getCartItemCount();
        if (cantidadCartDiv) {
            cantidadCartDiv.textContent = itemCount;
        }
    };

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
