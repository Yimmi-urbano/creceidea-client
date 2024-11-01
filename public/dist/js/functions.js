// functions.js
import { getDataAttributes, addToCart, getCartItemCount, showModal, closeModal, getCartItems, incrementQty, decrementQty, calculateCartSummary, updateSessionStorageCart } from './utils.js?v=10';

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
    if (!cart) return { productsContent: "<p>No items in the cart.</p>", summaryContent: "" };

    const { items_cart, Total, currency, cantItems } = cart;

    // HTML para la lista de productos
    let productsContent = '';
    items_cart.forEach(item => {
        productsContent += `
            <div class="bg-white p-2 rounded-lg mb-3 border border-zinc-200">
                <div class="flex items-baseline justify-between">
                     <div class="flex gap-3">
                            <div class="product-image w-[70px]">
                                <img src="${item.image}" alt="${item.title}" class="w-[70px] h-[70px] rounded inline-block mr-2">
                            </div>
                            <div class="product-price ">
                                <span class="lg:text-lg text-md"><strong>${item.title}</strong></span>
                                <p>Precio: S/ ${item.price_sale || item.price_regular}</p>
                            </div>
                     </div>
                    <div class="product-qty flex">
                        <button data-action="decrement" data-id="${item.id}" class="px-2 py-1 bg-gray-300 rounded">-</button>
                        <input type="number" id="qty-${item.id}" data-id="${item.id}" value="${item.qty}" min="1" class="w-12 text-center border">
                        <button data-action="increment" data-id="${item.id}" class="px-2 py-1 bg-gray-300 rounded">+</button>
                    </div>
                 </div>
            </div>
        `;
    });

    // HTML para el resumen del carrito
    const summaryContent = `
        <div class=" p-1 border border-b-0 border-x-0 border-zinc-500 flex w-full justify-between">
        <p class="text-xl"><strong>Total:</strong> S/ ${Total.toFixed(2)}</p>
        <p class="text-xl"><strong>Total Items:</strong> ${cantItems}</p>
            
        </div>
    `;

    return { productsContent, summaryContent };
};


const updateCartModalContent = () => {
    const productListContainer = document.getElementById('product-list');
    const cartSummaryContainer = document.getElementById('cart-summary');

    if (productListContainer && cartSummaryContainer) {
        const { productsContent, summaryContent } = renderCartItems();

        // Insertar el contenido en los contenedores fijos
        productListContainer.innerHTML = productsContent;
        cartSummaryContainer.innerHTML = summaryContent;
    }
};


document.addEventListener('DOMContentLoaded', () => {
    const openCart = document.querySelector('#openCart');
    const modalBody = document.querySelector('.modal-body');

    const openCartModal = () => {
        showModal({
            title: "Lista de pedido",
            content: '', // No se agrega contenido HTML aquí, ya está en el modal-body
            iconHTML: `<svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`,
            onConfirm: () => {
                console.log("Checkout process started");
                closeModal();
            }
        });

        // Actualizar contenido del modal
        updateCartModalContent();
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
        updateCartItemCount();
    });


    modalBody.addEventListener('input', (event) => {
        const target = event.target;
    
        // Verificar si el elemento es un campo de cantidad
        if (target.type === 'number' && target.hasAttribute('data-id')) {
            const id = target.getAttribute('data-id');
            const newQty = parseInt(target.value, 10);
    
            console.log(newQty)
            // Asegurarse de que la cantidad ingresada sea válida
            if (!isNaN(newQty) && newQty > 0) {
                // Actualizar la cantidad en el carrito
                const cart = getCartItems();
                const product = cart.items_cart.find(item => item.id === id);
    
                if (product) {
                    product.qty = newQty;
    
                    // Recalcular el total y la cantidad de ítems en el carrito
                    const { total, cantItems } = calculateCartSummary(cart.items_cart);
                    cart.Total = total;
                    cart.cantItems = cantItems;
    
                    // Guardar el carrito actualizado en sessionStorage
                    updateSessionStorageCart(cart);
    
                    // Refrescar el contenido del modal
                    updateCartModalContent();

                    updateCartItemCount();
                }
            }
        }
    });

});