const express = require('express');
require('dotenv').config();
const router = express.Router();
const { fetchCatalogo, fetchNavBar } = require('./apiService');
const { generarCodigoVersion } = require('./helpers')
const { getBanners, getInfoHomeText, getConfig } = require('./functions');
const DOMAIN_LOCAL = process.env.DOMAIN_LOCAL;
const version = generarCodigoVersion()
const errorHandler = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    res.status(500).send('Error al manejar la solicitud');
  }
};

router.use(errorHandler);


router.get('/', async (req, res) => {
  try {
    const domain = DOMAIN_LOCAL ?? req.hostname;
    const banners = await getBanners(domain);
    const contentHTML = await getInfoHomeText(domain);
    const Config = await getConfig(domain);
    const listCatalog = await fetchCatalogo(domain);
    const navbar = await fetchNavBar(domain)
 

    res.render('index', {v:version,navbar:navbar, dataProducts: listCatalog, banners: banners, contentHTML: contentHTML, GetInfo: Config, contentTemplate: 'home' });
  } catch (error) {
    res.render('error_page', { error: error });
  }
});

router.get('/catalog', async (req, res) => {
  const domain = DOMAIN_LOCAL ?? req.hostname;
  const listCatalog = await fetchCatalogo(domain);
  const contentHTML = await getInfoHomeText(domain);
  const Config = await getConfig(domain);
  const navbar = await fetchNavBar(domain);
  res.render('index', {v:version, navbar:navbar, dataProducts: listCatalog, pageTitle: 'Servicios', contentHTML: contentHTML, GetInfo: Config, contentTemplate: 'catalog' });
});

router.get('/detail-product/:rutaDinamica', async (req, res) => {
  const pgeCant = await getPageByIdProduct('/catalog/' + req.params.rutaDinamica);
  res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCant.title, contentHTML: pgeCant.description_short, contentTemplate: 'product_detail' });
});

// Ruta para renderizar el archivo style.ejs
router.get('/styles', (req, res) => {
  // Renderiza el archivo style.ejs
  res.set('Content-Type', 'text/css');
  res.render('styles');
});


/*
// Ruta para otras páginas
router.get('/:rutaDinamica', async (req, res) => {
  const pgeCont = await getPageByUrl(req.params.rutaDinamica);
  res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCont.title, contentHTML: pgeCont.content_html, contentTemplate: 'page' });
});
*/

module.exports = router;
