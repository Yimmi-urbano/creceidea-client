const express = require('express');
const path = require('path');
require('dotenv').config();

const {
  fetchCatalogo,
  fetchNavBar,
  fetchPageBySlug,
  getPageByIdProduct,
  fetchMenu,
  getPageByCategory
} = require('./apiService');
const { generarCodigoVersion } = require('./helpers');
const {
  getBanners,
  getInfoHomeText,
  getConfig,
  getSvgContent
} = require('./functions');

const router = express.Router();
const { DOMAIN_LOCAL } = process.env;
const version = generarCodigoVersion();

const errorHandler = (err, req, res, next) => {
  console.error('Error al manejar la solicitud:', err);
  res.status(500).render('error_page');
};

const fetchDataMiddleware = async (req, res, next) => {
  try {
    const domain = DOMAIN_LOCAL || req.hostname;
    const page = req.query.page;
    res.locals.domain = domain;
    res.locals.version = version;

    const [banners, contentHTML, config, navbar, catalog] = await Promise.all([
      getBanners(domain),
      getInfoHomeText(domain),
      getConfig(domain),
      fetchNavBar(domain),
      fetchCatalogo(domain,page)
    ]);

    res.locals = { ...res.locals, banners, contentHTML, config, navbar, catalog };
    next();
  } catch (error) {
    next(error);
  }
};

const fetchDataForRoutes = ['/', '/catalog', '/:slug'];
router.use(fetchDataForRoutes, fetchDataMiddleware);

router.get('/', (req, res) => {
  res.render('index', {
    v: res.locals.version,
    
    dataProducts: res.locals.catalog,
    banners: res.locals.banners,
    contentHTML: res.locals.contentHTML,
    GetInfo: res.locals.config,
    printContent: getSvgContent,
    contentTemplate: 'home'
  });


});

router.get('/catalog', (req, res) => {

  res.render('index', {
    v: res.locals.version,
    
    dataProducts: res.locals.catalog,
    pageTitle: 'Todos los productos',
    contentHTML: res.locals.contentHTML,
    GetInfo: res.locals.config,
    printContent: getSvgContent,
    contentTemplate: 'catalog'
  });
});

router.get('/styles', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.render('styles');
});

router.get('/detail-product/:rutaDinamica', async (req, res, next) => {
  try {
    const productPage = await getPageByIdProduct(`/catalog/${req.params.rutaDinamica}`);
    const menuOptions = await fetchMenu();

    res.render('index', {
      menuOptions,
      pageTitle: productPage.title,
      contentHTML: productPage.description_short,
      printContent: getSvgContent,
      contentTemplate: 'product_detail'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const page = await fetchPageBySlug(res.locals.domain, slug);

    res.render('index', {
      v: res.locals.version,
     
      infoPage: page,
      pageTitle: 'Servicios',
      contentHTML: res.locals.contentHTML,
      GetInfo: res.locals.config,
      printContent: getSvgContent,
      contentTemplate: 'page'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/category/:category', async (req, res, next) => {
  try {
    const domain = DOMAIN_LOCAL || req.hostname;
    const category = req.params.category;
    const categoryProducts = await getPageByCategory(domain, category);

    res.render('index', {
      v: res.locals.version,
     
      dataProducts: categoryProducts,
      pageTitle: category,
      contentHTML: res.locals.contentHTML,
      GetInfo: res.locals.config,
      printContent: getSvgContent,
      contentTemplate: 'catalog'
    });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
