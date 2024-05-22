const express = require('express');
require('dotenv').config();

const router = express.Router();
const { fetchCatalogo, fetchNavBar, fetchPageBySlug, getPageByIdProduct, fetchMenu } = require('./apiService');
const { generarCodigoVersion } = require('./helpers');
const { getBanners, getInfoHomeText, getConfig, getSvgContent } = require('./functions');

const DOMAIN_LOCAL = process.env.DOMAIN_LOCAL;
const version = generarCodigoVersion();

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error al manejar la solicitud:', err);
  res.status(500).render('error_page');
};

// Middleware para cargar datos
const fetchDataMiddleware = async (req, res, next) => {
  try {
    const domain = DOMAIN_LOCAL ?? req.hostname;
    res.locals.domain = domain;
    res.locals.version = version;
    
    const [banners, contentHTML, Config, navbar, listCatalog] = await Promise.all([
      getBanners(domain),
      getInfoHomeText(domain),
      getConfig(domain),
      fetchNavBar(domain),
      fetchCatalogo(domain)
    ]);

    res.locals.banners = banners;
    res.locals.contentHTML = contentHTML;
    res.locals.Config = Config;
    res.locals.navbar = navbar;
    res.locals.listCatalog = listCatalog;

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware específico para la carga de datos en las rutas necesarias
const fetchDataForRoutes = ['/', '/catalog', '/:slug'];
router.use(fetchDataForRoutes, fetchDataMiddleware);

router.get('/', (req, res) => {
  res.render('index', { 
    v: res.locals.version, 
    navbar: res.locals.navbar, 
    dataProducts: res.locals.listCatalog, 
    banners: res.locals.banners, 
    contentHTML: res.locals.contentHTML, 
    GetInfo: res.locals.Config, 
    printContent:getSvgContent,
    contentTemplate: 'home' 
  });
});

router.get('/catalog', (req, res) => {
  res.render('index', { 
    v: res.locals.version, 
    navbar: res.locals.navbar, 
    dataProducts: res.locals.listCatalog, 
    pageTitle: 'Servicios', 
    contentHTML: res.locals.contentHTML, 
    GetInfo: res.locals.Config, 
    printContent:getSvgContent,
    contentTemplate: 'catalog' 
  });
});

router.get('/styles', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.render('styles');
});

router.get('/detail-product/:rutaDinamica', async (req, res, next) => {
  try {
    const pgeCant = await getPageByIdProduct('/catalog/' + req.params.rutaDinamica);
    res.render('index', { 
      menuOptions: await fetchMenu(), 
      pageTitle: pgeCant.title, 
      contentHTML: pgeCant.description_short, 
      printContent:getSvgContent,
      contentTemplate: 'product_detail' 
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
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
      printContent:getSvgContent,
      contentTemplate: 'page' 
    });
  } catch (error) {
    next(error);
  }
});

// Middleware de manejo de errores al final
router.use(errorHandler);

module.exports = router;
