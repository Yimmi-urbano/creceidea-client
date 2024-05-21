const express = require('express');
require('dotenv').config();
const router = express.Router();
const { fetchCatalogo, fetchNavBar, fetchPageBySlug } = require('./apiService');
const { generarCodigoVersion } = require('./helpers');
const { getBanners, getInfoHomeText, getConfig } = require('./functions');

const DOMAIN_LOCAL = process.env.DOMAIN_LOCAL;
const version = generarCodigoVersion();

const errorHandler = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    res.status(500).send('Error al manejar la solicitud');
  }
};

router.use(errorHandler);

// Middleware para obtener los datos comunes
const fetchDataMiddleware = async (req, res, next) => {
  try {
    const domain = DOMAIN_LOCAL ?? req.hostname;
    res.locals.domain = domain;
    res.locals.version = version;
    res.locals.banners = await getBanners(domain);
    res.locals.contentHTML = await getInfoHomeText(domain);
    res.locals.Config = await getConfig(domain);
    res.locals.navbar = await fetchNavBar(domain);
    res.locals.listCatalog = await fetchCatalogo(domain);
    next();
  } catch (error) {
    next(error);
  }
};

router.use(fetchDataMiddleware);

router.get('/', async (req, res) => {
  try {
    res.render('index', { 
      v: res.locals.version, 
      navbar: res.locals.navbar, 
      dataProducts: res.locals.listCatalog, 
      banners: res.locals.banners, 
      contentHTML: res.locals.contentHTML, 
      GetInfo: res.locals.Config, 
      contentTemplate: 'home' 
    });
  } catch (error) {
    res.render('error_page', { error: error });
  }
});

router.get('/catalog', async (req, res) => {
  try {
    res.render('index', { 
      v: res.locals.version, 
      navbar: res.locals.navbar, 
      dataProducts: res.locals.listCatalog, 
      pageTitle: 'Servicios', 
      contentHTML: res.locals.contentHTML, 
      GetInfo: res.locals.Config, 
      contentTemplate: 'catalog' 
    });
  } catch (error) {
    res.render('error_page', { error: error });
  }
});

router.get('/styles', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.render('styles');
});

router.get('/detail-product/:rutaDinamica', async (req, res) => {
  try {
    const pgeCant = await getPageByIdProduct('/catalog/' + req.params.rutaDinamica);
    res.render('index', { 
      menuOptions: await fetchMenu(), 
      pageTitle: pgeCant.title, 
      contentHTML: pgeCant.description_short, 
      contentTemplate: 'product_detail' 
    });
  } catch (error) {
    res.render('error_page', { error: error });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const slugSearch = req.params.slug;
    const getPage = await fetchPageBySlug(res.locals.domain, slugSearch);
    res.render('index', { 
      v: res.locals.version, 
      navbar: res.locals.navbar, 
      infoPage: getPage, 
      pageTitle: 'Servicios', 
      contentHTML: res.locals.contentHTML, 
      GetInfo: res.locals.Config, 
      contentTemplate: 'page' 
    });
  } catch (error) {
    res.render('error_page', { error: error });
  }
});

module.exports = router;
