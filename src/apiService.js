
const axios = require('axios');
const { generarCodigoVersion } = require('./helpers');

const version = generarCodigoVersion;
let hostname = [];


async function fetchHome(domain) {

  hostname = domain.split('.')[0];

  try {
    const response = await axios.get(`https://storage.googleapis.com/stores-crece/freestore/basic_ecommerce/${hostname}/data/home.json?v=` + version);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchConfig(domain) {
  hostname = domain.split('.')[0];
  try {
    const response = await axios.get(`https://storage.googleapis.com/stores-crece/freestore/basic_ecommerce/${hostname}/data/config.json?v=` + version);
    return response.data.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}



module.exports = { fetchHome, fetchConfig };
