import {
    injectModalYapeQR
} from '../payment.js?v=67333w2222332222222222222222222222222';

export default async function izipayHandler(order, methodData) {

    injectModalYapeQR(order, methodData);

}