export function injectCheckoutPayment(resultMetod) {
    const isDev = resultMetod.isDev;
    const script = document.createElement("script");
    script.src = isDev
        ? "https://sandbox-checkout.izipay.pe/payments/v1/js/index.js"
        : "https://checkout.izipay.pe/payments/v1/js/index.js";
    script.async = true;
    document.head.appendChild(script);
}

export function activaBtnIzipay(authorization, resultOrder, resultMetod) {
    const { response: { token = undefined } = {} } = authorization;

    if (!token) return console.log("No se recibió token de autorización");

    const config = {
        transactionId: resultOrder.orderNumber,
        action: Izipay.enums.payActions.PAY,
        merchantCode: resultMetod.credentials.merchantId,
        order: {
            orderNumber: resultOrder.orderNumber,
            currency: "PEN",
            amount: resultOrder.total,
            processType: Izipay.enums.processType.AUTHORIZATION,
            merchantBuyerId: "mc1768",
            dateTimeTransaction: Date.now().toString(),
            payMethod: Izipay.enums.showMethods.ALL,
        },
        billing: {
            firstName: resultOrder.billingInfo.first_name,
            lastName: resultOrder.billingInfo.last_name,
            email: resultOrder.billingInfo.email,
            phoneNumber: resultOrder.billingInfo.phone,
            street: resultOrder.billingInfo.street_address,
            city: "lima",
            state: "lima",
            country: "PE",
            postalCode: "00001",
            document: resultOrder.billingInfo.number_doc,
            documentType: Izipay.enums.documentType.DNI,
        },
        render: {
            typeForm: Izipay.enums.typeForm.POP_UP,
            container: "#your-iframe-payment",
            showButtonProcessForm: false,
        },
        urlRedirect: "https://server.punto-web.com/comercio/creceivedemo.asp?p=h1",
        appearance: {
            logo: "https://logowik.com/content/uploads/images/shopping-cart5929.jpg",
        },
    };

    const checkout = new Izipay({ config });
    checkout.LoadForm({
        authorization: token,
        keyRSA: "RSA",
        callbackResponse: (res) => {
            document.querySelector("#payment-message").innerHTML = JSON.stringify(res, null, 2);
        },
    });
}
