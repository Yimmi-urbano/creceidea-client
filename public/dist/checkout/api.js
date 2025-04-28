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

export async function generateIzipayToken(order, transaccionId) {
    const domainContent = getMetaDom("domain");

    const headers = new Headers({
        transactionid: transaccionId,
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

export async function resetCart() {
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

export async function fetchOrderData(orderId) {

    const domainMeta = document.querySelector("meta[name='domain']");
    const domainContent = domainMeta ? domainMeta.getAttribute("content").trim() : null;

    const myHeaders = new Headers();
    myHeaders.append("domain", domainContent);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };


    try {
        const response = await fetch(`https://api-orders.creceidea.pe/api/orders/id/${orderId}`, requestOptions);
        const data = await response.json();

        if (!data) {
            throw new Error('Pedido no encontrado');
        }
        return data;
    } catch (error) {
        console.error("Error fetching order data:", error);
        return null;
    }
}

export async function updatePaymentStatus(status, message, orderId, paymentMethod) {

    const domainMeta = document.querySelector("meta[name='domain']");
    const domain = domainMeta ? domainMeta.getAttribute("content").trim() : null;

    const myHeaders = new Headers();
    myHeaders.append("domain", domain);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        typeStatus: status,
        message: message,
        methodPayment: paymentMethod,
    });

    try {
        const response = await fetch(`https://api-orders.creceidea.pe/api/orders/${orderId}/payment-status`, {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el estado de pago: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch {
        console.error("Error en actualizar el estado de pago:", error.message);
        throw new Error(`Error al actualizar el estado de pago: ${error.message}`);
    }
};