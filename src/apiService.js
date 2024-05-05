
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
    const response = await axios.get(`https://api.creceidea.pe/data/${hostname}/config.json?v=2` + version);
    return response.data.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchCatalogo(domain) {
  hostname = domain.split('.')[0];
  try {
    const response = await axios.get(`https://api.creceidea.pe/data/${hostname}/catalogo.json?v=` + version);
    return response.data.data;
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


module.exports = { fetchHome, fetchConfig, fetchCatalogo,fetchNavBar };
