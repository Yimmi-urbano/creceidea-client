import {
    getDataAttributes,
    addToCart,
    getCartItemCount,
    getCartItems,
    incrementQty,
    decrementQty,
    calculateCartSummary,
    updateSessionStorageCart,
    removeFromCart,
    toggleMiniCart

} from './utils.js?v=3126242222';

const cantidadCartDiv = document.querySelector('.count-products');
const closedCart = document.querySelector('.closedMiniCart');
const closedMiniCart = document.getElementById('modal-cancel-btn');
const closedMini = document.getElementById('cancel-btn');

const updateCartItemCount = () => {
    const itemCount = getCartItemCount();
    if (cantidadCartDiv) {
        cantidadCartDiv.textContent = itemCount;
    }
};

document.addEventListener('DOMContentLoaded', () => {

    updateCartItemCount();

    const buttons = document.querySelectorAll('.add_to_cart');
    const quantityInput = document.querySelector('#quantity');
    const btnCartToolBar = document.getElementById('openCart');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const data = getDataAttributes(button);
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            addToCart(data, quantity);
            
            btnCartToolBar.classList.add('animar-pulso');

            setTimeout(() => {
                btnCartToolBar.classList.remove('animar-pulso');
            }, 900);

            updateCartItemCount();
        });
    });
});

const renderCartItems = () => {

    const cart = getCartItems();
    if (!cart) return { productsContent: "<p>No items in the cart.</p>", summaryContent: "" };
    const { items_cart, Total, cantItems } = cart;
    const productsContent = items_cart.map(item => `

             <div class="flex items-center justify-between py-4">
                    <div class="flex items-center gap-3">
                        <img src="${item.image}"
                            alt="${item.title}" class="w-14 h-14 border border-1 border-gray-200 rounded-md object-cover">
                        <div>
                            <p class="text-sm font-semibold text-black">${item.title}</p>
                            <div class="flex items-center border border-gray-300 rounded-md mt-1 overflow-hidden w-fit">
                                <button class="px-2 text-lg text-gray-500 hover:text-black" data-action="decrement" data-id="${item.id}">−</button>
                                <input type="number" id="qty-${item.id}" data-id="${item.id}" value="${item.qty}" min="1" class="w-10 text-center border-l border-t-0 border-b-0  p-0 border-r border-gray-300 text-sm text-black outline-none" />
                                <button class="px-2 text-lg text-gray-500 hover:text-black" data-action="increment" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col items-end justify-between h-full gap-2">
              

                        <div class="delete-btn" data-id="${item.id}" data-action="delete">
  <svg xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-gray-400 cursor-pointer hover:text-red-500" fill="none"
      viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3m-4 0h16" />
  </svg>
</div>

                        <p class="text-sm font-bold text-black">S/ ${item.price_sale.toFixed(2) === "0.00" ? item.price_regular.toFixed(2) : item.price_sale.toFixed(2)}</p>
                    </div>
                </div>
    `).join("");

    const summaryContent = `

          <div class="flex justify-between text-sm text-black">
                <span>Subtotal</span>
                <span>S/ ${Total.toFixed(2)}</span>
            </div>
            <div class="border-t border-dashed my-2"></div>
             <div class="flex justify-between text-sm font-bold text-black">
                <span>Total</span>
                <span>S/ ${Total.toFixed(2)}</span>
            </div>
    `;

    return { productsContent, summaryContent };
};

const updateCartModalContent = () => {
    const productListContainer = document.getElementById('product-list');
    const cartSummaryContainer = document.getElementById('cart-summary');
    if (!productListContainer || !cartSummaryContainer) return;

    const { productsContent, summaryContent } = renderCartItems();
    productListContainer.innerHTML = productsContent;
    cartSummaryContainer.innerHTML = summaryContent;
};

const openCart = document.querySelector('#openCart');
const modalBody = document.querySelector('.content-min-cart');

const openCartModal = () => {
    toggleMiniCart();
    updateCartModalContent();
};

const closedCartModal = () => {
    toggleMiniCart();
    updateCartModalContent();
};

openCart.addEventListener('click', openCartModal);
closedCart.addEventListener('click', closedCartModal);
closedMiniCart.addEventListener('click', closedCartModal);
closedMini.addEventListener('click', closedCartModal);


modalBody.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-action');
    const id = actionEl.getAttribute('data-id');
    if (!id) return;

    switch (action) {
        case 'increment':
            incrementQty(id);
            break;
        case 'decrement':
            decrementQty(id);
            break;
        case 'delete':
            removeFromCart(id);
            break;
        default:
            console.warn(`Unknown action: ${action}`);
    }

    updateCartModalContent();
    updateCartItemCount();
});


modalBody.addEventListener('input', (event) => {
    const target = event.target;

    if (target.type === 'number' && target.hasAttribute('data-id')) {
        const id = target.getAttribute('data-id');
        const newQty = parseInt(target.value, 10);

        if (!isNaN(newQty) && newQty > 0) {

            const cart = getCartItems();
            const product = cart.items_cart.find(item => item.id === id);

            if (product) {
                product.qty = newQty;

                const { total, cantItems } = calculateCartSummary(cart.items_cart);
                cart.Total = total;
                cart.cantItems = cantItems;

                updateSessionStorageCart(cart);
                updateCartModalContent();
                updateCartItemCount();
            }
        }
    }
});

