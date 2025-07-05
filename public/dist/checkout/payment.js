import { updatePaymentStatus } from './api.js?v=2122212122';
import { redirectSuccess } from './redirect.js?v=2212122009912';

export function injectCheckoutPayment(resultMetod) {
    const isDev = resultMetod.isDev;
    const script = document.createElement("script");
    script.src = isDev
        ? "https://sandbox-checkout.izipay.pe/payments/v1/js/index.js"
        : "https://checkout.izipay.pe/payments/v1/js/index.js";
    script.async = true;
    document.head.appendChild(script);
}

export function activaBtnIzipay(authorization, resultOrder, resultMetod, transaccionId) {

    const { response: { token = undefined } = {} } = authorization;

    if (!token) return console.log("No se recibió token de autorización");

    const config = {
        transactionId: transaccionId,
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
                responseStatus = "decline"
            }

            const responseUpdate = await updatePaymentStatus(responseStatus, res.messageUser, resultOrder._id, "credit_card");

            res.code === "00" ? redirectSuccess(resultOrder.orderNumber, resultMetod.nameId) : alert(res.messageUser);

            console.log(res, responseUpdate)

        },
    });

}

export function injectModalYapeQR(order, methodData) {
    let existingModal = document.getElementById('modalYapeQr');
    if (existingModal) existingModal.remove();

    const html = `<div id="modalYapeQr"
      class="modal opacity-0 pointer-events-none fixed w-full h-full z-50 top-0 left-0 flex items-center justify-center transition-opacity duration-300">
      <div class="modal-container fixed w-full h-full z-50 overflow-y-auto p-3 bg-gray-600/30">
  
          <div class="modal-content mx-auto h-full rounded-lg max-w-[500px] flex flex-col justify-between bg-white text-left p-2 shadow-lg">
              <div>
                  <div class="card">
                      <div class="rounded-lg bg-orange-600 py-2">
                          <h4 class="text-sm text-white mt-1 text-center">Monto a Yapear/Plinear</h4>
                          <h3 class="text-2xl font-bold text-white mt-1 text-center">S/ ${order.total.toFixed(2)}</h3>
                      </div>
                  </div>
  
                  <div class="card">
                      <div class="rounded-lg p-4 text-sm  leading-5">
                        ${methodData['details'].description}
                      </div>
                  </div>
  
                  <div class="card">
                      <img class="w-[220px] m-auto rounded-lg overflow-hidden" src="${methodData['details'].urlQR}">
                  </div>

                  <div class="card">
                  <div class="tag-number-bm gap-1 flex justify-center items-center w-[140px] h-[30px] mx-auto bg-[#e2e2e2] rounded-[10px] text-[#525252] font-normal tracking-[0.5px]">
                  <div class="number_bm">${methodData['details'].number_yape}</div>
                  <div class="copy_number">
                  <svg class="h-5 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.53 8L14 2.47C13.8595 2.32931 13.6688 2.25018 13.47 2.25H11C10.2707 2.25 9.57118 2.53973 9.05546 3.05546C8.53973 3.57118 8.25 4.27065 8.25 5V6.25H7C6.27065 6.25 5.57118 6.53973 5.05546 7.05546C4.53973 7.57118 4.25 8.27065 4.25 9V19C4.25 19.7293 4.53973 20.4288 5.05546 20.9445C5.57118 21.4603 6.27065 21.75 7 21.75H14C14.7293 21.75 15.4288 21.4603 15.9445 20.9445C16.4603 20.4288 16.75 19.7293 16.75 19V17.75H17C17.7293 17.75 18.4288 17.4603 18.9445 16.9445C19.4603 16.4288 19.75 15.7293 19.75 15V8.5C19.7421 8.3116 19.6636 8.13309 19.53 8ZM14.25 4.81L17.19 7.75H14.25V4.81ZM15.25 19C15.25 19.3315 15.1183 19.6495 14.8839 19.8839C14.6495 20.1183 14.3315 20.25 14 20.25H7C6.66848 20.25 6.35054 20.1183 6.11612 19.8839C5.8817 19.6495 5.75 19.3315 5.75 19V9C5.75 8.66848 5.8817 8.35054 6.11612 8.11612C6.35054 7.8817 6.66848 7.75 7 7.75H8.25V15C8.25 15.7293 8.53973 16.4288 9.05546 16.9445C9.57118 17.4603 10.2707 17.75 11 17.75H15.25V19ZM17 16.25H11C10.6685 16.25 10.3505 16.1183 10.1161 15.8839C9.8817 15.6495 9.75 15.3315 9.75 15V5C9.75 4.66848 9.8817 4.35054 10.1161 4.11612C10.3505 3.8817 10.6685 3.75 11 3.75H12.75V8.5C12.7526 8.69811 12.8324 8.88737 12.9725 9.02747C13.1126 9.16756 13.3019 9.24741 13.5 9.25H18.25V15C18.25 15.3315 18.1183 15.6495 17.8839 15.8839C17.6495 16.1183 17.3315 16.25 17 16.25Z" fill="#e2e2e2"/>
</svg>
                  </div>
                  </div>
                  </div>
  
                  <div class="card">
                      <div class="rounded-lg p-4 mt-3">
                          <label class="block text-sm/6 text-center font-bold text-gray-900">Número de operación</label>
                          <input id="operationNumber" type="text"
                              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6">
                      </div>
                  </div>
              </div>
  
              <div class="flex justify-center flex-col gap-2 pt-2 w-full">
                  <button id="btnConfirmYape" class="px-4 w-full bg-sky-800 p-2 rounded-lg text-white hover:bg-sky-950 flex justify-center items-center gap-2">
                      <span class="label">Confirmar Pago</span>
                      <span class="spinner hidden w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </button>
                   <button class="px-4 modal-close w-full bg-gray-100 p-2 rounded-lg text-black hover:bg-sky-950 flex justify-center items-center gap-2">
                      <span class="label">Cancelar</span>
                      <span class="spinner hidden w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </button>
              </div>
          </div>
      </div>
  </div>`;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const modal = document.getElementById('modalYapeQr');
    const closeButtons = modal.querySelectorAll('.modal-close');
    const confirmButton = modal.querySelector('#btnConfirmYape');
    const label = confirmButton.querySelector('.label');
    const spinner = confirmButton.querySelector('.spinner');

    let isLoading = false;

    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');

    const closeModal = () => {
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => modal.remove(), 300);
    };

    const handleCancel = async () => {
        if (isLoading) return;
        await updatePaymentStatus("decline", "El usuario cerró el modal sin confirmar", order._id, methodData.nameId);
        closeModal();
    };

    const handleConfirm = async () => {
        const operationNumber = modal.querySelector('#operationNumber').value.trim();

        if (!operationNumber) {
            alert("Por favor, ingresa el número de operación.");
            return;
        }

        isLoading = true;

        spinner.classList.remove("hidden");
        label.textContent = "Procesando...";
        confirmButton.disabled = true;
        closeButtons.forEach(btn => btn.classList.add("pointer-events-none", "opacity-50"));

        try {
            await updatePaymentStatus("pending", `Confirmación enviada - Operación: ${operationNumber}`, order._id, methodData.nameId);
            redirectSuccess(order.orderNumber, methodData.nameId);
        } catch (err) {
            console.error("❌ Error al actualizar estado:", err);
        } finally {
            closeModal();
        }
    };

    closeButtons.forEach(btn => btn.addEventListener('click', handleCancel));
    confirmButton.addEventListener('click', handleConfirm);

}

export async function processWhatsApp(order, methodData) {

    try {
        await updatePaymentStatus("pending", `Pendiente de coordinacion por WhatsApp`, order._id, methodData.nameId);
        redirectSuccess(order.orderNumber, methodData.nameId);
    } catch (err) {
        console.error("❌ Error al actualizar estado:", err);
    } finally {
        console.log("Enviado correctamente");
    }

}