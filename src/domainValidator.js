const axios = require('axios');
const { generarCodigoVersion } = require('./helpers');

const version = generarCodigoVersion();

async function validateSubdomain(subdomain) {
    try {
        const response = await axios.post('https://api-domain.creceidea.pe/domains/exists', {
            domain: subdomain
        });

        const data = response.data;

        if (data && data.exists === true) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error('Error al validar el subdominio:', error);
        return false;
    }
}

module.exports = validateSubdomain;
