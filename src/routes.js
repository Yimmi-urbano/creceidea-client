const express = require('express');
const path = require('path');
require('dotenv').config();

const {
  fetchCatalogo,
  fetchNavBar,
  fetchPageBySlug,
  getPageByIdProduct,
  getPageByCategory
} = require('./apiService');
const { generarCodigoVersion } = require('./helpers');
const {
  getBanners,
  getConfig,
  getSvgContent
} = require('./functions');

const router = express.Router();
const { DOMAIN_LOCAL, API_PRODUCTS } = process.env;
const version = generarCodigoVersion();

const errorHandler = (err, req, res, next) => {
  console.error('Error al manejar la solicitud:', err);
  res.status(500).render('error_page');
};

const fetchDataMiddleware = async (req, res, next) => {
  try {
    const domain = DOMAIN_LOCAL || req.hostname;
    const api_product= API_PRODUCTS;
    const page = req.query.page;
    res.locals.domain = domain;
    res.locals.api_product= api_product;
    res.locals.version = version;

    const [banners, config, navbar, catalog] = await Promise.all([
      getBanners(domain),
      getConfig(domain),
      fetchNavBar(domain),
      fetchCatalogo(domain,page)
    ]);

    res.locals = { ...res.locals, banners, config, navbar, catalog, api_product };
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
    GetInfo: res.locals.config,
    api_product:res.locals.api_product,
    printContent: getSvgContent,
    contentTemplate: 'home'
  });


});

router.get('/catalog', (req, res) => {

  try {
    const domain = DOMAIN_LOCAL || req.hostname;
    const categorySlug = req.params.category;
    const navbar = res.locals.navbar;
    let categoryData = navbar;
    let subcategoryData = null;
    console.log(categoryData)

    if (!categoryData) {
      for (const category of navbar) {
        subcategoryData = category.children.find(subcat => subcat.slug === categorySlug);
        if (subcategoryData) {
          categoryData = category; 
          break;
        }
      }
    }

    if (!categoryData && !subcategoryData) {
      return res.status(404).render('error_page', { message: 'Categoría no encontrada' });
    }

    const pageTitle = subcategoryData ? subcategoryData.title : categoryData.title;
    const subcategories = subcategoryData ? [] : categoryData || [];


  res.render('index', {
    v: res.locals.version,
    dataProducts: res.locals.catalog,
    subcategories,
    pageTitle,
    GetInfo: res.locals.config,
    api_product:res.locals.api_product,
    printContent: getSvgContent,
    contentTemplate: 'catalog'
  });
} catch (error) {

  next(error);
}
});

router.get('/styles', (req, res) => {
  res.set('Content-Type', 'text/css');
  res.render('styles');
});

router.get('/product/:rutaDinamica', async (req, res, next) => {
  const domain = DOMAIN_LOCAL || req.hostname;
  const slug = req.params.rutaDinamica;
  try {
  
    res.render('index', {
      v: res.locals.version,
      pageTitle: productPage.title,
      api_product:res.locals.api_product,
      printContent: getSvgContent,
      GetInfo: res.locals.config,
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
      GetInfo: res.locals.config,
      api_product:res.locals.api_product,
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
    const categorySlug = req.params.category;
    const navbar = res.locals.navbar;
    let categoryData = navbar.find(cat => cat.slug === categorySlug);
    let subcategoryData = null;

    if (!categoryData) {
      for (const category of navbar) {
        subcategoryData = category.children.find(subcat => subcat.slug === categorySlug);
        if (subcategoryData) {
          categoryData = category; 
          break;
        }
      }
    }

    if (!categoryData && !subcategoryData) {
      return res.status(404).render('error_page', { message: 'Categoría no encontrada' });
    }

    const pageTitle = subcategoryData ? subcategoryData.title : categoryData.title;
    const subcategories = subcategoryData ? [] : categoryData.children || [];
    const categoryProducts = await getPageByCategory(domain, categorySlug);

    res.render('index', {
      v: res.locals.version,
      dataProducts: categoryProducts,
      pageTitle,
      subcategories,
      GetInfo: res.locals.config,
      api_product: res.locals.api_product,
      printContent: getSvgContent,
      contentTemplate: 'catalog'
    });
  } catch (error) {
    next(error);
  }
});



router.use(errorHandler);

module.exports = router;
