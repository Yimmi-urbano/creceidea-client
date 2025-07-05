import {
    handleContinuePayment,
    handleSaveInformation,
    handleCreateOrder,
    renderCartItemsToDOM
} from './dom.js?v=12342232';

document.addEventListener('DOMContentLoaded', () => {
    renderCartItemsToDOM();
    handleContinuePayment();
    handleSaveInformation();
    handleCreateOrder();
});