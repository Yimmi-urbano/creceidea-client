import {
    setCookie,
    getCookie,
    getOrderData,
    initializeValidation,
    getDataAttributes,
    addToCart,
    getCartItemCount,
    getCartItems,
    incrementQty,
    decrementQty,
    calculateCartSummary,
    updateSessionStorageCart,
    showNotification,
    loaderProcess,
    removeFromCart

} from './utils.js?v=3126';

const cantidadCartDiv = document.querySelector('.count-products');
const btnGetPaymentform = document.getElementById('send-order-end');
const btnSendOrderAndCheckout = document.getElementById('modal-confirm-btn');
const btnPaymentMethodProcess = document.getElementById('payment-process');
const domainMeta = document.querySelector("meta[name='domain']");
const domainContent = domainMeta ? domainMeta.getAttribute("content").trim() : null;


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

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const data = getDataAttributes(button);
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            addToCart(data, quantity);
            showNotification(data.title, data.image);

            updateCartItemCount();
        });
    });
});

const renderCartItems = () => {
    const cart = getCartItems();
    if (!cart) return { productsContent: "<p>No items in the cart.</p>", summaryContent: "" };

    const { items_cart, Total, cantItems } = cart;

    const productsContent = items_cart.map(item => `
        <div class="bg-white p-2 rounded-lg mb-4 shadow-md border border-zinc-200 relative">
            <button data-id="${item.id}" data-action="delete" class="flex z-10 h-[25px] w-[25px] justify-center left-[-10px] top-[-10px] rounded-xl items-center absolute bg-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="relative z-[-1]"  viewBox="0 0 16 16" width="16px" height="16px"><path fill="#ffffff" d="M 6.496094 1 C 5.675781 1 5 1.675781 5 2.496094 L 5 3 L 2 3 L 2 4 L 3 4 L 3 12.5 C 3 13.324219 3.675781 14 4.5 14 L 10.5 14 C 11.324219 14 12 13.324219 12 12.5 L 12 4 L 13 4 L 13 3 L 10 3 L 10 2.496094 C 10 1.675781 9.324219 1 8.503906 1 Z M 6.496094 2 L 8.503906 2 C 8.785156 2 9 2.214844 9 2.496094 L 9 3 L 6 3 L 6 2.496094 C 6 2.214844 6.214844 2 6.496094 2 Z M 4 4 L 11 4 L 11 12.5 C 11 12.78125 10.78125 13 10.5 13 L 4.5 13 C 4.21875 13 4 12.78125 4 12.5 Z M 5 5 L 5 12 L 6 12 L 6 5 Z M 7 5 L 7 12 L 8 12 L 8 5 Z M 9 5 L 9 12 L 10 12 L 10 5 Z"/></svg>
            </button>
            <div class="flex items-center justify-between">
                <div class="flex gap-3">
                    <div class="product-image m-2">
                        <img src="${item.image}" alt="${item.title}" class="w-[50px] h-[50px] cover rounded inline-block mr-2">
                    </div>
                    <div class="product-price text-left">
                        <p class="lg:text-sm text-sm font-medium">${item.title}</p>
                         <p>S/ ${item.price_sale || item.price_regular}</p>
                    </div>
                </div>
                <div class="product-qty flex-row row">
                    <div class="flex flex-col">
                        <button data-action="decrement" data-id="${item.id}" class="px-2 bg-gray-200 rounded-t-md">-</button>
                        <input type="number" id="qty-${item.id}" data-id="${item.id}" value="${item.qty}" min="1" class="w-10 text-center border border-gray-200">
                        <button data-action="increment" data-id="${item.id}" class="px-2 bg-gray-200 rounded-b-md">+</button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    const summaryContent = `
        <div class="p-1 flex w-full justify-between">
         <p class="text-md"><strong>Total Items:</strong> ${cantItems}</p>
            <p class="text-md"><strong>Total:</strong> S/ ${Total.toFixed(2)}</p>
           
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
const confirmShop = document.getElementById('modal-confirm-btn');
const canceldMiniCart = document.getElementById('modal-cancel-btn');

function toggleMiniCart() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const isActive = sidebar.classList.toggle("active");
    overlay.classList.toggle("active", isActive);
}

const openCartModal = () => {
    toggleMiniCart();
    updateCartModalContent();
};


openCart.addEventListener('click', openCartModal);
confirmShop.addEventListener('click', openModalShopForm);
canceldMiniCart.addEventListener('click', toggleMiniCart);

modalBody.addEventListener('click', (event) => {
    const target = event.target;
    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');

    if (!action || !id) return;

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


function openModalShopForm() {

    const formShoppingData = document.getElementById("form-shopping");
    formShoppingData.classList.remove("hidden");
    toggleMiniCart();
    initializeValidation();
}

function openModalShopFormPayment() {

    const formShoppingPayment = document.getElementById("form-payment");
    formShoppingPayment.classList.remove("hidden");
}

const baseHeaders = new Headers({
    "Content-Type": "application/json",
    "domain": domainContent
});

async function checkCartSync(cart) {
    loaderProcess(true);

    const headers = new Headers(baseHeaders);
    const sessionid = getCookie("sessionid");
    if (sessionid) headers.append("sessionid", sessionid);

    try {
        const response = await fetch("https://api-sync-cart.creceidea.pe/api/cart/sync", {
            method: "POST",
            headers,
            body: JSON.stringify(cart),
            redirect: "follow"
        });

        const result = await response.json();
        if (result.sessionId) setCookie("sessionid", result.sessionId, 1);
        loaderProcess(false);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function summaryCheckout(cart) {
    const conTotal = document.querySelectorAll('.subtotal');
    const cantItems = document.querySelectorAll('.cant-items');

    conTotal.forEach(element => {
        element.innerHTML = `<b>Subtotal:</b> S/ ${cart['Total'].toFixed(2)}`;
    });

    cantItems.forEach(element => {
        element.innerHTML = `<b>Cantidad:</b> ${cart['cantItems']}`;
    });
}

async function processPayment() {
    const cart = getCartItems();
    const result = await checkCartSync(cart);


    if (result) {
        updateSessionStorageCart(result.cart);
        summaryCheckout(result.cart)
        return await createOrder(result.cart)
    }
}

async function resetCart() {
    const sessionid = getCookie("sessionid");
    try {
        const myHeaders = new Headers();
        myHeaders.append("domain", domainContent);
        myHeaders.append("sessionid", sessionid);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await fetch("https://api-sync-cart.creceidea.pe/api/cart/delete", requestOptions);

        if (response.ok) {
            document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return false;
    }
}

async function createOrder(cart) {

    loaderProcess(true)

    const { clientInfo, billingInfo, shippingInfo } = await getOrderData();
    const headers = {
        "domain": domainContent,
        "Content-Type": "application/json"
    };

    const body = JSON.stringify({
        "products": cart.items_cart,
        clientInfo,
        billingInfo,
        shippingInfo,
        total: cart.Total,
        currency: cart.currency,
        paymentStatus: {
            typeStatus: 'pending',
            message: '',
            data: '',
            methodPayment: ''
        },
        orderStatus: {
            typeStatus: 'pending',
            message: '',
            date: ''
        }


    });

    const requestOptions = {
        method: "POST",
        headers: headers,
        body: body,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://api-orders.creceidea.pe/api/orders", requestOptions);
        if (!response.ok) {
            return { success: false, message: "Error en la solicitud" };
        }

        const data = await response.json();
        return {
            success: true,
            total: data.total || 0,
            currency: data.currency || "USD",
            orderNumber: data.orderNumber,
            statusPayment: data.paymentStatus || "pending"
        };

    } catch (error) {
        console.error("Error:", error);
        loaderProcess(false)
        return { success: false, message: error.message };
    }
}

btnGetPaymentform.addEventListener('click', async () => {
    const cart = getCartItems();
    const result = await checkCartSync(cart);

    if (result) {
        updateSessionStorageCart(result.cart);
        openModalShopFormPayment()
        summaryCheckout(result.cart)

    }
});

btnSendOrderAndCheckout.addEventListener('click', async () => {
    const cart = getCartItems();
    const result = await checkCartSync(cart);

    if (result) {
        updateSessionStorageCart(result.cart);
        summaryCheckout(result.cart)
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const payButton = document.querySelector("#payment-process");

    payButton.disabled = true;

    const updatePayButtonState = () => {
        const isSelected = Array.from(paymentMethods).some((method) => method.checked);
        payButton.disabled = !isSelected;
    };

    paymentMethods.forEach((method) => {
        method.addEventListener("change", updatePayButtonState);
    });

    const executePayment = () => {
        const selectedMethod = Array.from(paymentMethods).find((method) => method.checked)?.value;

        if (!selectedMethod) {
            alert("Por favor, selecciona un método de pago.");
            return;
        }

        switch (selectedMethod) {
            case "whatsapp":
                handleWhatsAppPayment();
                break;
            case "creditCard":
                handleCreditCardPayment();
                break;
            default:
                alert("Método de pago no soportado.");
        }
    };

    const handleWhatsAppPayment = async () => {

        const ProcessCreateOrder = await processPayment();

        if (ProcessCreateOrder.success) {
            sessionStorage.removeItem("cart_tem");
            await resetCart();
            window.location.href = `/order/thanks?orderID=${ProcessCreateOrder.orderNumber}&methodPay=whatsapp`;
        }

    };

    const handleCreditCardPayment = () => {
        alert("Procesando pago con tarjeta de crédito...");
        console.log("Abriendo pasarela de pago...");
    };

    payButton.addEventListener("click", executePayment);
});