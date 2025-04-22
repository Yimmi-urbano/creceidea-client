import {
    injectModalYapeQR
} from '../payment.js?v=23222www2222222223';

import {
    generateIzipayToken,
} from '../api.js?v=2322232';

export default async function izipayHandler(order, methodData) {

    injectModalYapeQR(order, methodData);

}