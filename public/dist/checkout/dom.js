import {
    getCartItems,
    updateSessionStorageCart,
    getOrderData
} from '../js/utils.js';

import {
    checkCartSync,
    fetchPaymentMethod,
    createOrder,
    generateIzipayToken
} from './api.js';

import {
    activaBtnIzipay,
    injectCheckoutPayment
} from './payment.js?v=22';

const btnContinuePayment = document.getElementById('payment-btn');
const btnCreateOrder = document.getElementById('create-order');
const btnSaveInformation = document.getElementById('save-information');
const contentInformationContact = document.getElementById('orderForm');
const contentSummaryPay = document.getElementById('summary-pay');
const containerSummaryProducts = document.getElementById('summary-products');
const productListContainer = document.getElementById('product-list');
const totalAmount = document.getElementById('totalAmount');
const methodPayments = document.getElementById('method-payments');

export function renderCartItemsToDOM() {
    const cart = getCartItems();
    if (!cart) return;

    const { items_cart, Total } = cart;

    const productsContent = items_cart.map(item => `
        <div class="flex justify-between gap-2 items-center mb-2">
            <div class="flex gap-3">
                <img class="object-cover rounded-[var(--border-radius)] w-10 bg-white border border-slate-200"
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
    totalAmount.innerHTML = Total.toFixed(2);
}

export function handleContinuePayment() {
    btnContinuePayment.addEventListener('click', async () => {
        const cart = getCartItems();
        const result = await checkCartSync(cart);

        if (result) {
            updateSessionStorageCart(result.cart);
            contentInformationContact.classList.remove('hidden');
            btnContinuePayment.classList.add('hidden');
            methodPayments.classList.add('hidden');
            btnSaveInformation.classList.remove('hidden');
        }
    });
}

export function handleSaveInformation() {
    btnSaveInformation.addEventListener('click', async () => {
        const cart = getCartItems();
        const result = await checkCartSync(cart);
        const { clientInfo } = await getOrderData();

        const metodPayment = obtenerMetodoDePagoSeleccionado();
        const resultMetod = await fetchPaymentMethod(metodPayment);

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
            injectCheckoutPayment(resultMetod);
        }
    });
}

export function handleCreateOrder() {
    btnCreateOrder.addEventListener('click', async () => {
        const cart = getCartItems();
        const result = await checkCartSync(cart);

        const metodPayment = obtenerMetodoDePagoSeleccionado();
        const resultMetod = await fetchPaymentMethod(metodPayment);

        if (result) {
            const resultOrder = await createOrder(result.cart);
            const authorization = await generateIzipayToken(resultOrder);
            activaBtnIzipay(authorization, resultOrder, resultMetod);
        }
    });
}

function obtenerMetodoDePagoSeleccionado() {
    const seleccionado = document.querySelector('#list_method_payments input[name="payment"]:checked');
    return seleccionado ? seleccionado.id : null;
}
