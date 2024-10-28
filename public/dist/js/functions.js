// functions.js
import { getDataAttributes, addToCart, getCartItemCount } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add_to_cart');
    const cantidadCartDiv = document.querySelector('.count-products');

    const updateCartItemCount = () => {
        const itemCount = getCartItemCount();
        if (cantidadCartDiv) {
            cantidadCartDiv.textContent = itemCount;
        }
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const data = getDataAttributes(button);
            addToCart(data);
            updateCartItemCount(); 
        });
    });

    updateCartItemCount(); 
});
