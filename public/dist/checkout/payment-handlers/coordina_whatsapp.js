import {
    processWhatsApp
} from '../payment.js?v=67333w22223322222222222222222';

export default async function izipayHandler(order, methodData) {

    processWhatsApp(order, methodData);

}