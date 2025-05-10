const express = require('express');
const path = require('path');
require('dotenv').config();

const {
  fetchCatalogo,
  fetchNavBar,
  fetchPageBySlug,
  getPageByIdProduct,
  getPageByCategory,
  getPaymentsMethods,
  getProductsByTitle
} = require('./apiService');

const { generarCodigoVersion } = require('./helpers');
const { getBanners, getConfig, getSvgContent } = require('./functions');

const router = express.Router();

const { DOMAIN_LOCAL, API_PRODUCTS } = process.env;
const version = generarCodigoVersion();

const errorHandler = (err, req, res, next) => {
  console.error('Error en la solicitud:', err);
  res.status(500).render('error_page');
};

const fetchDataMiddleware = async (req, res, next) => {
  try {
    const domain = DOMAIN_LOCAL || req.hostname;
    const page = req.query.page;

    const [banners, config, navbar, catalog, paymentMethods] = await Promise.all([
      getBanners(domain),
      getConfig(domain),
      fetchNavBar(domain),
      fetchCatalogo(domain, page),
      getPaymentsMethods(domain)
    ]);

    res.locals = {
      domain,
      version,
      api_product: API_PRODUCTS,
      banners,
      config,
      navbar,
      catalog,
      paymentMethods
    };

    next();
  } catch (error) {
    next(error);
  }
};

const fetchDataRoutes = ['/', '/catalog', '/:slug'];
router.use(fetchDataRoutes, fetchDataMiddleware);

// Utilidad para renderizar
const renderPage = (res, contentTemplate, extraData = {}) => {
  res.render('index', {
    v: res.locals.version,
    api_product: res.locals.api_product,
    printContent: getSvgContent,
    GetInfo: res.locals.config,
    ...extraData,
    contentTemplate
  });
};

router.get('/', (req, res) => {
  renderPage(res, 'home', {
    dataProducts: res.locals.catalog,
    banners: res.locals.banners
  });
});

router.get('/catalog', (req, res, next) => {
  try {
    renderPage(res, 'catalog', {
      dataProducts: res.locals.catalog,
      subcategories: res.locals.navbar,
      pageTitle: 'Todos los productos'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/checkout', (req, res, next) => {
  try {
    renderPage(res, 'checkout', {
      getPayments: res.locals.paymentMethods
    });
  } catch (error) {
    next(error);
  }
});

router.get('/styles', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.render('styles');
});

router.get('/search', async (req, res, next) => {
  try {
    const { page, query } = req.query;
    const domain = res.locals.domain;
    const results = await getProductsByTitle(domain, page, query);

    renderPage(res, 'catalog', {
      dataProducts: results,
      subcategories: res.locals.navbar,
      pageTitle: `Resultados de búsqueda de:<br><b>${query}</b>`
    });
  } catch (error) {
    next(error);
  }
});

router.get('/product/:slug', async (req, res, next) => {
  try {
    const domain = res.locals.domain;
    const { slug } = req.params;
    const product = await getPageByIdProduct(domain, slug);

    renderPage(res, 'product_detail', {
      pageTitle: product.title,
      dataProductDetail: product,
      imagesProducts: product.image_default
    });
  } catch (error) {
    next(error);
  }
});

router.get('/order/thanks', (req, res, next) => {
  try {
    renderPage(res, 'thanks');
  } catch (error) {
    next(error);
  }
});

router.get('/customer/claimbook', (req, res, next) => {
  try {
    renderPage(res, 'claim-book');
  } catch (error) {
    next(error);
  }
});

router.get('/category/:category', async (req, res, next) => {
  try {
    const domain = res.locals.domain;
    const { category: slug } = req.params;
    const { navbar } = res.locals;
    const page = req.query.page;

    let category = navbar.find(cat => cat.slug === slug);
    let subcategory = null;

    if (!category) {
      for (const cat of navbar) {
        subcategory = cat.children.find(sub => sub.slug === slug);
        if (subcategory) {
          category = cat;
          break;
        }
      }
    }

    if (!category && !subcategory) {
      return res.status(404).render('error_page', { message: 'Categoría no encontrada' });
    }

    const pageTitle = subcategory?.title || category.title;
    const subcategories = subcategory ? [] : category.children || [];
    const products = await getPageByCategory(domain, slug, page);

    renderPage(res, 'catalog', {
      dataProducts: products,
      pageTitle,
      subcategories
    });
  } catch (error) {
    next(error);
  }
});

/*
// Si luego quieres usar páginas por slug, descomenta esto
router.get('/:slug', async (req, res, next) => {
  try {
    const page = await fetchPageBySlug(res.locals.domain, req.params.slug);

    renderPage(res, 'page', {
      infoPage: page,
      pageTitle: 'Servicios'
    });
  } catch (error) {
    next(error);
  }
});
*/

router.use(errorHandler);

module.exports = router;
