import {
    handleContinuePayment,
    handleSaveInformation,
    handleCreateOrder,
    renderCartItemsToDOM
} from './dom.js?v=21231222332222';

document.addEventListener('DOMContentLoaded', () => {
    renderCartItemsToDOM();
    handleContinuePayment();
    handleSaveInformation();
    handleCreateOrder();
});