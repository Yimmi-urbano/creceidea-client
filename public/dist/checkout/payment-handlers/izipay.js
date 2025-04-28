import {
    activaBtnIzipay,
    injectCheckoutPayment
} from '../payment.js?v=232222222222223';

import {
    generateIzipayToken,
} from '../api.js?v=23222322222222';

export default async function izipayHandler(order, methodData) {
    const transaccionId = Math.floor(100000 + Math.random() * 900000);
    injectCheckoutPayment(methodData);
    const authorization = await generateIzipayToken(order, transaccionId);
    activaBtnIzipay(authorization, order, methodData, transaccionId);
}