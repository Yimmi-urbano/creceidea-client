
const axios = require('axios');

async function fetchMenu() {
  try {
    const response = await axios.get('https://recursing-banzai.74-208-244-91.plesk.page/json/menu.json?v=5');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchPages() {
  try {
    const response = await axios.get('https://recursing-banzai.74-208-244-91.plesk.page/json/pages.json?v=2');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchCatalogo() {
  try {
    const response = await axios.get('https://recursing-banzai.74-208-244-91.plesk.page/json/catalogo.json?v=2');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}




module.exports = { fetchMenu, fetchPages, fetchCatalogo };
