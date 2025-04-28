import {
    injectModalYapeQR
} from '../payment.js?v=67333w222233222222222222222';

export default async function izipayHandler(order, methodData) {

    injectModalYapeQR(order, methodData);

}