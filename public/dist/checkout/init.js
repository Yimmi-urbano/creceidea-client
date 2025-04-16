import {
    handleContinuePayment,
    handleSaveInformation,
    handleCreateOrder,
    renderCartItemsToDOM
} from './dom.js?v=212312';

document.addEventListener('DOMContentLoaded', () => {
    renderCartItemsToDOM();
    handleContinuePayment();
    handleSaveInformation();
    handleCreateOrder();
});