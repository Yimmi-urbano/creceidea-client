
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

async function fetchNavBar(domain) {
  hostname = domain.split('.')[0];
  try {
    const response = await axios.get(`https://api.creceidea.pe/data/${hostname}/navigation.json?v=` + version);
    return response.data.data;
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

const fetchUserTheme = async (domain) => {

  const hostname = domain.split('.')[0];
  let theme_select;

  if (hostname == 'donguston') {
    theme_select = 'theme002';

  } else {

    theme_select = 'theme001';

  }

  return theme_select

};

module.exports = { fetchHome, fetchConfig, fetchCatalogo, fetchNavBar, fetchPageBySlug, getPageByCategory, fetchUserTheme };
