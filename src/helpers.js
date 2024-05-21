
function generarCodigoVersion() {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2); // Añadir un 0 al principio si es necesario
    const day = ('0' + fecha.getDate()).slice(-2); // Añadir un 0 al principio si es necesario
    const hours = ('0' + fecha.getHours()).slice(-2); // Añadir un 0 al principio si es necesario
    const minutes = ('0' + fecha.getMinutes()).slice(-2); // Añadir un 0 al principio si es necesario
    const seconds = ('0' + fecha.getSeconds()).slice(-2); // Añadir un 0 al principio si es necesario
    const miliseconds = fecha.getMilliseconds();

    const codigoVersion = `${year}${month}${day}${hours}${minutes}${seconds}${miliseconds}`;

    return codigoVersion;
}


module.exports = { generarCodigoVersion };