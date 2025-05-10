import {
    getCartItems,
    setCookie,
    getCookie,
    updateSessionStorageCart,
    getOrderData
} from '../js/utils.js?v=23221212';

const btnContinuePayment = document.getElementById('payment-btn');
const btnCreateOrder = document.getElementById('create-order');
const contentSummaryPay = document.getElementById('summary-pay');
const contentInformationContact = document.getElementById('orderForm');
const btnSaveInformation = document.getElementById('save-information');
const containerSummaryProducts = document.getElementById('summary-products');

document.addEventListener('DOMContentLoaded', () => {
    const buttonTypeDocument = document.getElementById('button_type_document');
    const menuTypeDocument = document.getElementById('menu_type_document');
    const listTypeDocument = document.getElementById('list_type_document');
    const labelTypeDocument = document.getElementById('label_type_document');

    if (!buttonTypeDocument || !menuTypeDocument || !listTypeDocument || !labelTypeDocument) {
        console.warn("Uno o más elementos del menú no existen en el DOM.");
        return;
    }

    buttonTypeDocument.addEventListener('click', () => {
        menuTypeDocument.classList.toggle('hidden');
    });

    listTypeDocument.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            labelTypeDocument.textContent = event.target.textContent;
            menuTypeDocument.classList.add('hidden');
        }
    });

    document.addEventListener('click', (event) => {
        const isClickInside = buttonTypeDocument.contains(event.target) || menuTypeDocument.contains(event.target);

        if (!isClickInside) {
            menuTypeDocument.classList.add('hidden');
        }
    });
});

const baseHeaders = new Headers({
    "Content-Type": "application/json",
    "domain": getMetaDom('domain')
});

async function checkCartSync(cart) {
    //loaderProcess(true);

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
        // loaderProcess(false);
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function summaryCheckout(cart) {
    const conTotal = document.querySelectorAll('#totalAmount');
    const cantItems = document.querySelectorAll('.cant-items');

    conTotal.forEach(element => {
        element.innerHTML = `${cart['Total'].toFixed(2)}`;
    });

    cantItems.forEach(element => {
        element.innerHTML = `${cart['cantItems']}`;
    });
}

const renderCartItems = () => {
    const cart = getCartItems();
    if (!cart) return { productsContent: "<p>No items in the cart.</p>", summaryContent: "" };

    const { items_cart, Total, cantItems } = cart;

    const productsContent = items_cart.map(item => `
         <div class="flex justify-between gap-2 items-center mb-2">
                            <div class="flex gap-3">
                             <img class="object-cover rounded-[var(--border-radius)] w-10 bg-white border border-slate-200"
                                src="${item.image}"
                                alt="${item.title}">
                                    <div>
                                    <p class="text-sm font-medium">${item.title}</p>
                                    <p class="text-xs text-gray-500">S/ ${item.price_sale === 0 ? item.price_regular.toFixed(2) : item.price_sale.toFixed(2)} x ${item.qty}</p>
                                    
                                    </div>
                            </div>
                            <p class="text-sm font-medium">S/ ${item.price_sale === 0 ? (item.price_regular * item.qty).toFixed(2) : (item.price_sale * item.qty).toFixed(2)}</p>
                        </div>
    `).join("");

    const summaryContent = `
        <div class="p-1 flex w-full justify-between">
         <p class="text-md"><strong>Total Items:</strong> ${cantItems}</p>
         <p class="text-md"><strong>Total:</strong> S/ ${Total.toFixed(2)}</p>
        </div>`;

    const totalContent = Total.toFixed(2);

    return { productsContent, summaryContent, totalContent };
};

function getMetaDom(nameMeta) {
    const metaTag = document.querySelector('meta[name="' + nameMeta + '"]');
    if (metaTag) {
        return metaTag.getAttribute("content");
    } else {
        console.warn("No se encontró la etiqueta meta con name='domain'");
        return null;
    }
}

function obtenerMetodoDePagoSeleccionado() {
    const seleccionado = document.querySelector('#list_method_payments input[name="payment"]:checked');
    if (seleccionado) {
        return seleccionado.id;
    } else {
        return null;
    }
}

async function fetchPaymentMethod(metodPayment) {
    try {

        if (!metodPayment) {
            throw new Error("El parámetro 'method' es requerido en la URL.");
        }

        const currentDomain = getMetaDom('domain');


        const myHeaders = new Headers();
        myHeaders.append("domain", currentDomain);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const url = `https://api-payment-method.creceidea.pe/api/payments/${metodPayment}`;

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Ocurrió un error al obtener el método de pago:", error.message);
        return null;
    }
}

async function createOrder(cart) {

    // loaderProcess(true)

    const domainContent = getMetaDom('domain');

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
            billingInfo: data.billingInfo,
            statusPayment: data.paymentStatus || "pending"
        };

    } catch (error) {
        console.error("Error:", error);
        //loaderProcess(false)
        return { success: false, message: error.message };
    }
}

async function generateIzipayToken(resultOrder) {
    const myHeaders = new Headers();
    const domainContent = getMetaDom('domain');
    myHeaders.append("transactionid", resultOrder.orderNumber);
    myHeaders.append("domain", domainContent);
    myHeaders.append("ordernumber", resultOrder.orderNumber);
    myHeaders.append("amount", resultOrder.total.toFixed(2));

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: null,
        redirect: "follow"
    };

    try {
        const response = await fetch("https://api-payment-method.creceidea.pe/api/payments/token/izipay", requestOptions);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error al generar token:", error.message);
        return null;
    }
}

async function activaBtnIzipay(authorization, resultOrder, resultMetod) {

    const { response: { token = undefined, error } = { response: undefined, error: 'NODE_API' } } = authorization;

    if (!!token) {

        const buttonPay = document.querySelector('#btnPayNow');

        buttonPay.disabled = false;
        buttonPay.innerHTML = `S/ ${resultOrder.total.toFixed(2)} →`;

        const iziConfig = {
            config: {
                transactionId: resultOrder.orderNumber,
                action: Izipay.enums.payActions.PAY,
                merchantCode: resultMetod.credentials['merchantId'],
                order: {
                    orderNumber: resultOrder.orderNumber,
                    currency: 'PEN',
                    amount: resultOrder.total,
                    processType: Izipay.enums.processType.AUTHORIZATION,
                    merchantBuyerId: 'mc1768',
                    dateTimeTransaction: '1670258741603000', //currentTimeUnix
                    payMethod: Izipay.enums.showMethods.ALL, //
                },
                billing: {
                    firstName: resultOrder.billingInfo['first_name'],
                    lastName: resultOrder.billingInfo['last_name'],
                    email: resultOrder.billingInfo['email'],
                    phoneNumber: resultOrder.billingInfo['phone'],
                    street: resultOrder.billingInfo['street_address'],
                    city: 'lima',
                    state: 'lima',
                    country: 'PE',
                    postalCode: '00001',
                    document: resultOrder.billingInfo['number_doc'],
                    documentType: Izipay.enums.documentType.DNI,
                },
                render: {
                    typeForm: Izipay.enums.typeForm.POP_UP,
                    container: '#your-iframe-payment',
                    showButtonProcessForm: false,
                },
                urlRedirect: 'https://server.punto-web.com/comercio/creceivedemo.asp?p=h1',
                appearance: {
                    logo: 'https://logowik.com/content/uploads/images/shopping-cart5929.jpg',
                    /*customize: {
                        visibility: {
                            hideOrderNumber: true,
                            hideSuccessPage: false,
                            hideErrorPage: false,
                            hideIconCloseCheckout: true,
                            hideLogo: true,
                            hideMessageActivateOnlinePurchases: true,
                            hideTestCards: true,
                            hideShakeValidation: true,
                        },
                    }*/
                },
                /*originEntry:{
                    originCode: ''
                }*/
            },
        };

        const callbackResponsePayment = response => document.querySelector('#payment-message').innerHTML = JSON.stringify(response, null, 2);

        const handleLoadForm = () => {
            try {
                const checkout = new Izipay({ config: iziConfig?.config });

                checkout &&
                    checkout.LoadForm({
                        authorization: token,
                        keyRSA: 'RSA',
                        callbackResponse: callbackResponsePayment,
                    });

            } catch (error) {
                console.log(error.message, error.Errors, error.date);
            }
        };

       // document.querySelector('#btnPayNow').addEventListener('click', async (event) => {
            //event.preventDefault();
           // handleLoadForm();
       // });

        handleLoadForm();

    } else if (error) {
        console.log('error-->', error);
    }

}

export function injectCheckoutPayment(resultMetod) {
    const isDev = resultMetod.isDev;
    const script = document.createElement('script');
    script.src = isDev
        ? 'https://sandbox-checkout.izipay.pe/payments/v1/js/index.js'
        : 'https://checkout.izipay.pe/payments/v1/js/index.js';
    script.async = true;
    document.head.appendChild(script);
}

btnContinuePayment.addEventListener('click', async function () {

    const methodPayments = document.getElementById('method-payments');
    const cart = getCartItems();
    const result = await checkCartSync(cart);

    if (result) {
        updateSessionStorageCart(result.cart);
        summaryCheckout(result.cart)

        try {
            contentInformationContact.classList.remove('hidden');
            methodPayments.classList.add('hidden');
            btnContinuePayment.classList.add('hidden');
            btnSaveInformation.classList.remove('hidden');


        } catch (error) {
            console.error("Error al continuar con el pago:", error.message);
        }

    }


});

btnSaveInformation.addEventListener('click', async function () {
    
    const cart = getCartItems();
    const result = await checkCartSync(cart);
    const { clientInfo } = await getOrderData();

    const metodPayment = obtenerMetodoDePagoSeleccionado();
    const resultMetod = await fetchPaymentMethod(metodPayment);
 
    document.querySelector('.detail-customer .text-name-full').innerHTML = clientInfo.first_name+' '+clientInfo.last_name;
    document.querySelector('.detail-customer .text-documento').innerHTML = clientInfo.number_doc;
    document.querySelector('.detail-customer .text-correo').innerHTML = clientInfo.email;
    document.querySelector('.detail-customer .text-celular').innerHTML = clientInfo.phone;
    document.querySelector('.detail-customer .text-direccion').innerHTML = clientInfo.street_address;

    if (result) {

        try {

            contentSummaryPay.classList.remove('hidden');
            contentInformationContact.classList.add('hidden');
            btnCreateOrder.classList.remove('hidden');
            btnSaveInformation.classList.add('hidden');
            containerSummaryProducts.classList.remove('hidden');
            injectCheckoutPayment(resultMetod);

        } catch (error) {
            console.error("Error al continuar con el pago:", error.message);
        }

    }

})

btnCreateOrder.addEventListener('click', async function () {

    const cart = getCartItems();
    const result = await checkCartSync(cart);

    const metodPayment = obtenerMetodoDePagoSeleccionado();
    const resultMetod = await fetchPaymentMethod(metodPayment);


    if (result) {

        try {

            const resultOrder = await createOrder(result.cart);
            const authorization = await generateIzipayToken(resultOrder);
            activaBtnIzipay(authorization, resultOrder, resultMetod);


        } catch (error) {
            console.error("Error al continuar con el pago:", error.message);
        }
    }



})


const productListContainer = document.getElementById('product-list');
//const cartSummaryContainer = document.getElementById('cart-summary');
const totalAmount = document.getElementById('totalAmount');
//if (!productListContainer || !cartSummaryContainer) return;

const { productsContent, summaryContent, totalContent } = renderCartItems();
productListContainer.innerHTML = productsContent;
//cartSummaryContainer.innerHTML = summaryContent;
totalAmount.innerHTML = totalContent;