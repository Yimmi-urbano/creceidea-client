
const axios = require('axios');
const { generarCodigoVersion } = require('./helpers');

const version = generarCodigoVersion();
let hostname = [];


async function fetchHome(domain) {

  hostname = domain.split('.')[0];

  try {
    const response = await axios.get(`https://api.creceidea.pe/data/${hostname}/home.json?v=` + version);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchBanners(domain) {

  hostname = domain.split('.')[0];

  try {
    const response = await axios.get(`https://api-configuration.creceidea.pe/api/banners`,{

      headers: {
        'domain': hostname
      }

    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchConfig(domain) {
  hostname = domain.split('.')[0];

  try {
    const response = await axios.get(`https://api-configuration.creceidea.pe/api/configurations`, {

      headers: {
        'domain': hostname
      }

    });
    return response.data[0];
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchCatalogo(domain,page) {

  hostname = domain.split('.')[0];
  try {
    const response = await axios.get(`https://api-products.creceidea.pe/api/products?page=`+page, {
      headers: {
        'domain': hostname
      }
    });

    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function getPageByCategory(domain, nameCategory) {
  hostname = domain.split('.')[0];
  try {
    const response = await axios.get(`https://api-products.creceidea.pe/api/products/category/` + nameCategory, {
      headers: {
        'domain': hostname
      }
    });

    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}


async function getPageByIdProduct(domain,slug) {
  hostname = domain.split('.')[0];
  try {
    const response = await axios.get(`https://api-products.creceidea.pe/api/client/products/` + slug, {
      headers: {
        'domain': hostname
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}


async function fetchNavBar(domain) {
  hostname = domain.split('.')[0];
  try {
    const response = await axios.get(`https://api-categories.creceidea.pe/api/categories`, {
      headers: {
        'domain': hostname
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchPageBySlug(domain, slugSearch) {
  const hostname = domain.split('.')[0];
  try {
    const response = await axios.get('https://api-pages.creceidea.pe/api/pages/slug/' + slugSearch, {
      headers: {
        'domain': hostname
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

module.exports = {getPageByIdProduct, fetchHome, fetchConfig, fetchCatalogo, fetchNavBar, fetchPageBySlug, getPageByCategory, fetchBanners };
