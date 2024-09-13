const axios = require('axios');
const { generarCodigoVersion } = require('./helpers');
require('dotenv').config();
const version = generarCodigoVersion();
const API_DOMAIN_VALIDATE = process.env.API_DOMAIN_VALIDATE;

async function validateSubdomain(subdomain) {
    try {
        const response = await axios.post(`${API_DOMAIN_VALIDATE}/domains/exists`, {
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
