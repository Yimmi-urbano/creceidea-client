export  function redirectSuccess(orderNumber,methodId){
    window.location.href = `/order/thanks?orderID=${orderNumber}&methodPay=${methodId}`;
}

export  function redirectFailed(){
    window.location.href = `/order/thanks?orderID=${order.orderNumber}&methodPay=${methodId}`;
}