import { updatePaymentStatus } from './api.js?v=212212122';
import { redirectSuccess } from './redirect.js?v=221212009912';

export function injectCheckoutPayment(resultMetod) {
    const isDev = resultMetod.isDev;
    const script = document.createElement("script");
    script.src = isDev
        ? "https://sandbox-checkout.izipay.pe/payments/v1/js/index.js"
        : "https://checkout.izipay.pe/payments/v1/js/index.js";
    script.async = true;
    document.head.appendChild(script);
}

export function injectModalYapeQR(order, methodData) {
    const html = `<div id="myModal"
    class="modal opacity-0 pointer-events-none fixed w-full h-full z-50 top-0 left-0 flex items-center justify-center transition-opacity duration-300">

    <div class="modal-container fixed w-full h-full z-50 overflow-y-auto p-3 bg-gray-600/30">
        <div
            class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-black text-sm z-50">
            <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                viewBox="0 0 18 18">
                <path
                    d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z">
                </path>
            </svg>
            (Esc)
        </div>

        <div class="modal-content mx-auto h-full rounded-lg max-w-[500px] flex flex-col justify-between bg-white text-left p-2 shadow-lg">
            <div>
                <div class="card">
                    <div class="rounded-lg bg-orange-600 p-4">
                        <h4 class="text-sm text-white mt-1  text-center">Monto a Yapear/Plinear</h4>
                        <h3 class="text-3xl font-bold text-white mt-1  text-center">S/ 120.00</h3>
                    </div>
                </div>

                <div class="card">
                    <div class="rounded-lg p-4 mt-3">
                        Escanea el QR e ingresa el monto a pagar, envia la captura a este Whatsapp: 999888777
                    </div>
                </div>

                <div class="card">
                    <img class="w-[220px] m-auto rounded-lg overflow-hidden"
                        src="https://media-static.creceidea.pe/inversionesvargas/images/products/captura-de-pantalla-2025-03-20-a-las-09-1742488589361.webp">
                </div>

                <div class="card">
                    <div class="rounded-lg p-4 mt-3">
                        <label for="email" class="block text-sm/6 font-bold text-gray-900">Numero de operacion</label>
                        <div class="mt-1">
                            <input id="email" name="email" type="email" autocomplete="email"
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-center pt-2 w-full">
                <button class="modal-close px-4 w-full bg-sky-800 p-2 rounded-lg text-white hover:bg-sky-950">
                    Confirmar Pago</button>
            </div>
        </div>
    </div>
</div>
    `;
  
    // Crear contenedor temporal
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
  
    const modal = document.getElementById('myModal');
    //const openBtn = document.getElementById('openModal');
    const closeButtons = modal.querySelectorAll('.modal-close');

    modal.classList.remove('opacity-0', 'pointer-events-none');
  
    /*
    // Abrir modal
    openBtn.addEventListener('click', () => {
      modal.classList.remove('opacity-0', 'pointer-events-none');
    });
    */
  
    // Cerrar modal
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.add('opacity-0', 'pointer-events-none');
      });
    });
  
    // Esc key para cerrar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.classList.add('opacity-0', 'pointer-events-none');
      }
    });
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
        callbackResponse: async (res) => {

            let responseStatus;

            if (res.code === "00") {
                responseStatus = "completed"
            } else {
                responseStatus = "failed"
            }

            const responseUpdate = await updatePaymentStatus(responseStatus, res.messageUser, resultOrder._id, "credit_card");

            res.code === "00" ? redirectSuccess(resultOrder.orderNumber,resultMetod.nameId) : alert(res.messageUser);

            console.log(res, responseUpdate)

        },
    });

}

