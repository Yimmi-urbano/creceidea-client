import {
    getCartItems,
    updateSessionStorageCart,
    getOrderData,
    loaderProcess
} from '../js/utils.js?v=55332251';

import {
    checkCartSync,
    fetchPaymentMethod,
    createOrder,
    resetCart,
    fetchOrderData
} from './api.js?v=12356722333334489';

import * as paymentHandlers from './payment-handlers/index.js?v=533332355';

const btnContinuePayment = document.getElementById('payment-btn');
const btnCreateOrder = document.getElementById('create-order');
const btnSaveInformation = document.getElementById('save-information');
const contentInformationContact = document.getElementById('orderForm');
const contentSummaryPay = document.getElementById('summary-pay');
const containerSummaryProducts = document.getElementById('summary-products');
const productListContainer = document.getElementById('product-list');
const productListModalContainer = document.getElementById('product-list-modal');
const totalAmount = document.getElementById('totalAmount');
const methodPayments = document.getElementById('method-payments');
const totalItems = document.getElementById('totalItems');

export function renderCartItemsToDOM() {
    const cart = getCartItems();
    if (!cart) return;

    const { items_cart, Total, cantItems } = cart;

    const productsContent = items_cart.map(item => `
        <div class="flex justify-between gap-2 items-center mb-2">
            <div class="flex gap-3">
                <img class="object-cover rounded-md w-10 bg-white border border-slate-200"
                    src="${item.image}" alt="${item.title}">
                <div>
                    <p class="text-sm font-medium">${item.title}</p>
                    <p class="text-xs text-gray-500">S/ ${item.price_sale === 0 ? item.price_regular.toFixed(2) : item.price_sale.toFixed(2)} x ${item.qty}</p>
                </div>
            </div>
            <p class="text-sm font-medium">S/ ${item.price_sale === 0 ? (item.price_regular * item.qty).toFixed(2) : (item.price_sale * item.qty).toFixed(2)}</p>
        </div>
    `).join("");

    productListContainer.innerHTML = productsContent;
    productListModalContainer.innerHTML = productsContent;
    totalAmount.innerHTML = Total.toFixed(2);
    totalItems.innerHTML = cantItems;
}

export function handleContinuePayment() {

    btnContinuePayment.addEventListener('click', async () => {

        loaderProcess(true);

        const cart = getCartItems();
        const result = await checkCartSync(cart);

        if (result) {
            updateSessionStorageCart(result.cart);
            contentInformationContact.classList.remove('hidden');
            btnContinuePayment.classList.add('hidden');
            methodPayments.classList.add('hidden');
            btnSaveInformation.classList.remove('hidden');
            document.querySelector("#info_contact").classList.add('active');
            loaderProcess(false);
        }
    });
}



export function handleSaveInformation() {

    btnSaveInformation.addEventListener('click', async () => {

        loaderProcess(true);

        const cart = getCartItems();
        const result = await checkCartSync(cart);
        const { clientInfo } = await getOrderData();

        if (clientInfo.street_address === "") {
            document.querySelector('.content_direccion').classList.add('hidden');
        }

        document.querySelector('.detail-customer .text-name-full').textContent = `${clientInfo.first_name} ${clientInfo.last_name}`;
        document.querySelector('.detail-customer .text-documento').textContent = clientInfo.number_doc;
        document.querySelector('.detail-customer .text-correo').textContent = clientInfo.email;
        document.querySelector('.detail-customer .text-celular').textContent = clientInfo.phone;
        document.querySelector('.detail-customer .text-direccion').textContent = clientInfo.street_address;

        if (result) {
            contentSummaryPay.classList.remove('hidden');
            contentInformationContact.classList.add('hidden');
            btnCreateOrder.classList.remove('hidden');
            btnSaveInformation.classList.add('hidden');
            containerSummaryProducts.classList.remove('hidden');
            loaderProcess(false);
            document.querySelector("#summary_shop").classList.add('active');
        }
    });
}

function setOrderIdCookie(orderId) {
    const expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 1000);
    document.cookie = `orderId=${orderId}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
}

function getOrderIdCookie() {
    const name = "orderId=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    return null;
}


export function handleCreateOrder() {

    btnCreateOrder.addEventListener('click', async () => {
        loaderProcess(true);
        const cart = getCartItems();
        const cartSync = await checkCartSync(cart);
        if (!cartSync) return;
        const methodId = obtenerMetodoDePagoSeleccionado();
        const methodData = await fetchPaymentMethod(methodId);
        if (!methodData) return;

        let order;

        let orderId = getOrderIdCookie();

        if (orderId) {

            order = await fetchOrderData(orderId)

        } else {
            order = await createOrder(cartSync.cart);
            setOrderIdCookie(order.orderNumber);
        }

        if (!order) return;

        const handler = paymentHandlers[methodData.nameId];

        if (handler) {
            await handler(order, methodData);
            sessionStorage.removeItem("cart_tem");
            await resetCart();
            loaderProcess(false);
        } else {
            sessionStorage.removeItem("cart_tem");
            await resetCart();
        }
    });
}

function obtenerMetodoDePagoSeleccionado() {
    const seleccionado = document.querySelector('#list_method_payments input[name="payment"]:checked');
    return seleccionado ? seleccionado.id : null;
}

const form = document.getElementById('orderForm');
const inputs = form.querySelectorAll('input');


const validityState = {
    first_name: false,
    last_name: false,
    email: false,
    number_doc: false,
    celular: false,
    street_address: true
};


const validationRules = {
    first_name: [
        { validate: value => value.trim() !== '', message: 'El nombre completo es obligatorio.' },
        { validate: value => value.trim() !== '', message: 'Debe ingresar al menos nombre y apellido.' }
    ],
    last_name: [
        { validate: value => value.trim() !== '', message: 'El nombre completo es obligatorio.' },
        { validate: value => value.trim() !== '', message: 'Debe ingresar al menos nombre y apellido.' }
    ],
    email: [
        { validate: value => value.trim() !== '', message: 'El correo es obligatorio.' },
        { validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), message: 'El formato del correo no es válido.' }
    ],
    number_doc: [
        { validate: value => /^[0-9]{8,11}$/.test(value.trim()), message: 'El documento debe tener entre 8 y 11 dígitos.' }
    ],
    celular: [
        { validate: value => value.trim() !== '', message: 'El celular es obligatorio.' },
        { validate: value => /^[0-9]{9,9}$/.test(value.trim()), message: 'El celular debe tener 9 dígitos.' }
    ],
    street_address: []
};


function validateField(input) {
    const fieldName = input.name;
    const rules = validationRules[fieldName];
    const errorElement = form.querySelector(`.error-message[data-for="${fieldName}"]`);
    let isFieldValid = true;

    for (const rule of rules) {
        if (!rule.validate(input.value)) {
            isFieldValid = false;
            errorElement.textContent = rule.message;
            input.classList.remove('border-gray-300', 'border-gray-400');
            input.classList.add('border-red-500');
            break;
        }
    }

    if (isFieldValid) {
        errorElement.textContent = '';
        input.classList.remove('border-gray-300', 'border-red-500');
        input.classList.add('border-gray-400');
        errorElement.classList.remove('text-red-600');
        errorElement.classList.add('text-green-600');
    } else {
        errorElement.classList.remove('text-green-600');
        errorElement.classList.add('text-red-600');
    }
    validityState[fieldName] = isFieldValid;
    checkFormValidity();
}

function checkFormValidity() {
    const isFormFullyValid = Object.values(validityState).every(Boolean);
    btnSaveInformation.disabled = !isFormFullyValid;
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("button_type_document");
    const menu = document.getElementById("menu_type_document");
    const label = document.getElementById("label_type_document");
    const options = document.querySelectorAll("#list_type_document li");
    const optionsPayment = document.querySelectorAll("#list_method_payments li input")

    optionsPayment.forEach(payment => {
        payment.addEventListener("click", () => {
            btnContinuePayment.removeAttribute('disabled')
        });
    });

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("hidden");
    });

    options.forEach(option => {
        option.addEventListener("click", () => {
            label.textContent = option.textContent.trim();
            menu.classList.add("hidden");
        });
    });

    document.addEventListener("click", (e) => {
        if (!menu.classList.contains("hidden")) {
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.classList.add("hidden");
            }
        }
    });
});

inputs.forEach(input => {
    input.addEventListener('input', () => {
        validateField(input);
    });
});

checkFormValidity();