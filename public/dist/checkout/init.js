import {
    handleContinuePayment,
    handleSaveInformation,
    handleCreateOrder,
    renderCartItemsToDOM
} from './dom.js?v=9090';

document.addEventListener('DOMContentLoaded', () => {
    renderCartItemsToDOM();
    handleContinuePayment();
    handleSaveInformation();
    handleCreateOrder();
});