import {
    setCookie,
    getCookie,
    getOrderData,
    initializeValidation,
    getDataAttributes,
    addToCart,
    getCartItemCount,
    showModal,
    closeModal,
    getCartItems,
    incrementQty,
    decrementQty,
    calculateCartSummary,
    updateSessionStorageCart,
    showNotification,
    loaderProcess

} from './utils.js?v=27';

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
    const buttons = document.querySelectorAll('.add_to_cart');
    const quantityInput = document.querySelector('#quantity');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const data = getDataAttributes(button);
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            addToCart(data, quantity);
            showNotification(data.title, data.image)
            updateCartItemCount();
        });
    });

    updateCartItemCount();


});

const renderCartItems = () => {
    const cart = getCartItems();
    if (!cart) return { productsContent: "<p>No items in the cart.</p>", summaryContent: "" };

    const { items_cart, Total, currency, cantItems } = cart;

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

    const summaryContent = `
        <div class="p-1 flex w-full justify-between">
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
            content: '',
            iconHTML: `<svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`,
            onConfirm: () => {
                console.log("Checkout process started");
                closeModal();
                openModalShopForm()
            },
            onClosed: () => {
                closeModal();
            }
        });
        updateCartModalContent();
    };


    openCart.addEventListener('click', openCartModal);

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

});

function openModalShopForm() {

    const formShoppingData = document.getElementById("form-shopping");
    formShoppingData.classList.remove("hidden");
    initializeValidation()
}

function openModalShopFormPayment() {

    const formShoppingPayment = document.getElementById("form-payment");
    formShoppingPayment.classList.remove("hidden");
}

async function checkCartSync(cart) {

    loaderProcess(true)

    const headers = new Headers();
    const domain = domainContent;
    const sessionid = getCookie("sessionid");

    if (sessionid) {
        headers.append("sessionid", sessionid);
    }

    headers.append("domain", domain);
    headers.append("Content-Type", "application/json");

    const raw = JSON.stringify(cart);

    const options = {
        method: "POST",
        headers: headers,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://api-sync-cart.creceidea.pe/api/cart/sync", options);
        const result = await response.json();

        if (result.sessionId) {
            setCookie("sessionid", result.sessionId, 1);
        }
        loaderProcess(false)
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
