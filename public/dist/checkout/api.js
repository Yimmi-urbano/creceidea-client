import { getCookie, setCookie, getOrderData } from '../js/utils.js';

function getMetaDom(nameMeta) {
    const metaTag = document.querySelector(`meta[name="${nameMeta}"]`);
    return metaTag ? metaTag.getAttribute("content") : null;
}

export async function checkCartSync(cart) {
    const headers = new Headers({
        "Content-Type": "application/json",
        "domain": getMetaDom("domain"),
    });

    const sessionid = getCookie("sessionid");
    if (sessionid) headers.append("sessionid", sessionid);

    const response = await fetch("https://api-sync-cart.creceidea.pe/api/cart/sync", {
        method: "POST",
        headers,
        body: JSON.stringify(cart),
    });

    const result = await response.json();
    if (result.sessionId) setCookie("sessionid", result.sessionId, 1);
    return result;
}

export async function fetchPaymentMethod(methodPayment) {
    const domain = getMetaDom("domain");

    const response = await fetch(`https://api-payment-method.creceidea.pe/api/payments/${methodPayment}`, {
        method: "GET",
        headers: { domain },
    });

    return await response.json();
}

export async function createOrder(cart) {
    const domainContent = getMetaDom("domain");
    const { clientInfo, billingInfo, shippingInfo } = await getOrderData();

    const body = JSON.stringify({
        products: cart.items_cart,
        clientInfo,
        billingInfo,
        shippingInfo,
        total: cart.Total,
        currency: cart.currency,
        paymentStatus: { typeStatus: 'pending' },
        orderStatus: { typeStatus: 'pending' }
    });

    const response = await fetch("https://api-orders.creceidea.pe/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "domain": domainContent
        },
        body,
    });

    return await response.json();
}

export async function generateIzipayToken(order) {
    const domainContent = getMetaDom("domain");

    const headers = new Headers({
        transactionid: order.orderNumber,
        domain: domainContent,
        ordernumber: order.orderNumber,
        amount: order.total.toFixed(2),
    });

    const response = await fetch("https://api-payment-method.creceidea.pe/api/payments/token/izipay", {
        method: "POST",
        headers,
    });

    return await response.json();
}
