const axios = require('axios');
const { generarCodigoVersion } = require('./helpers');
require('dotenv').config();
const version = generarCodigoVersion();
let hostname = [];

const API_PRODUCTS = process.env.API_PRODUCTS;
const API_CATEGORIES = process.env.API_CATEGORIES;
const API_CONFIGURATION = process.env.API_CONFIGURATION;
const API_PAYMENTS_METHOD = process.env.API_PAYMENTS_METHOD;

async function fetchHome(domain) {

  hostname = domain.split('.')[0];

  try {
    const response = await axios.get(`https://api.creceidea.pe/data/${hostname}/home1.json?v=` + version);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchBanners(domain) {

  hostname = domain;

  try {
    const response = await axios.get(`${API_CONFIGURATION}/api/banners`, {

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
  hostname = domain;
  try {
    const response = await axios.get(`${API_CONFIGURATION}/api/configurations`, {

      headers: {
        'domain': hostname
      }

    });
    return response.data[0];
  } catch (error) {
    throw new Error('Error al obtener datos de la API', error);
  }
}

async function fetchCatalogo(domain, page) {

  hostname = domain;

  try {
    const response = await axios.get(`${API_PRODUCTS}/api/products?page=` + page, {
      headers: {
        'domain': hostname
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function getProductsByTitle(domain, page, query) {

  hostname = domain;
  
  try {
    const response = await axios.get(`${API_PRODUCTS}/api/products/search?page=${page}&query=${query}`, {
      headers: {
        'domain': hostname
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function getPageByCategory(domain, nameCategory, page) {
  hostname = domain;
  try {
    const response = await axios.get(`${API_PRODUCTS}/api/products/category/${nameCategory}?page=${page}`, {
      headers: {
        'domain': hostname
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function getPageByIdProduct(domain, slug) {
  hostname = domain;
  try {
    const response = await axios.get(`${API_PRODUCTS}/api/products/client/` + slug, {
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
  hostname = domain;
  try {
    const response = await axios.get(`${API_CATEGORIES}/api/categories`, {
      headers: {
        'domain': hostname
      }
    });
    return response.data;
  } catch (error) {
    return [];
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
    return response.data ?? [];
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function getPaymentsMethods(domain) {
  
  hostname = domain;

  try {
    const response = await axios.get(`${API_PAYMENTS_METHOD}/api/payments`, {

      headers: {
        'domain': hostname
      }

    });
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }

}

module.exports = {
  getPageByIdProduct,
  fetchHome,
  fetchConfig,
  fetchCatalogo,
  fetchNavBar,
  fetchPageBySlug,
  getPageByCategory,
  fetchBanners,
  getPaymentsMethods,
  getProductsByTitle
};
