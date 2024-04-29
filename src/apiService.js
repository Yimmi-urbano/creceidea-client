
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

async function fetchMenu() {
  try {
    const response = await axios.get('https://recursing-banzai.74-208-244-91.plesk.page/json/menu.json?v='+version);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchPages() {
  try {
    const response = await axios.get('https://recursing-banzai.74-208-244-91.plesk.page/json/pages.json?v='+version);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchHome() {
  try {
    const response = await axios.get('https://storage.googleapis.com/stores-crece/freestore/basic_ecommerce/fiberstar/data/home.json?v='+version);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}

async function fetchConfig() {
  try {
    const response = await axios.get('https://storage.googleapis.com/stores-crece/freestore/basic_ecommerce/fiberstar/data/config.json?v='+version);
    return response.data.data;
  } catch (error) {
    throw new Error('Error al obtener datos de la API');
  }
}



module.exports = { fetchMenu, fetchPages, fetchHome,fetchConfig };
