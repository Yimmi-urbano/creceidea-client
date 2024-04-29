const axios = require('axios');

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
  
  const version=generarCodigoVersion()
async function validateSubdomain(subdomain) {
    try {
        const response = await axios.get('https://storage.googleapis.com/stores-crece/central/data-center/domain.json?v='+version);
        const data = response.data;

        if (data && data.status && data.data && Array.isArray(data.data)) {
            const domainInfo = data.data.find(item => item.domain === subdomain);
            return !!domainInfo && domainInfo.type_domain === 'subdomain';
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error al validar el subdominio:', error);
        return false;
    }
}

module.exports = validateSubdomain;
