import {
    activaBtnIzipay,
    injectCheckoutPayment
} from '../payment.js?v=23222223';

import {
    generateIzipayToken,
} from '../api.js?v=232223222';

export default async function izipayHandler(order, methodData) {

            injectCheckoutPayment(methodData);
            const authorization = await generateIzipayToken(order);
            activaBtnIzipay(authorization, order, methodData);
}