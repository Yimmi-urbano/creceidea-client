const axios = require('axios');

async function validateSubdomain(subdomain) {
    try {
        const response = await axios.get('https://storage.googleapis.com/stores-crece/central/data-center/domain.json');
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
