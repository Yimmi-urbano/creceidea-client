const express = require('express');
const router = express.Router();
const { fetchCatalogo, fetchMenu } = require('./apiService');
const { getPageByUrl, getPageByIdProduct } = require('./functions');

// Middleware para manejar errores
const errorHandler = (req, res, next) => {
  try {
    next();
  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    res.status(500).send('Error al manejar la solicitud');
  }
};

// Rutas
router.use(errorHandler);

// Ruta para la página de inicio
router.get('/', async (req, res) => {
  //const pgeCont = await getPageByUrl('/');
  //res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCont.title, contentHTML: pgeCont.content_html, contentTemplate: 'home' });

  res.render('index', { contentHTML:'', pageTitle: '', contentTemplate: 'home' });


});

// Ruta para la página de catálogo
router.get('/catalog', async (req, res) => {
  const listCatalog = await fetchCatalogo();
  res.render('index', { listCatalog, menuOptions: await fetchMenu(), pageTitle: 'Servicios', contentHTML: 'Pagina de lista de servicios', contentTemplate: 'catalog' });
});

// Ruta para detalles del producto en el catálogo
router.get('/catalog/:rutaDinamica', async (req, res) => {
  const pgeCant = await getPageByIdProduct('/catalog/' + req.params.rutaDinamica);
  res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCant.title, contentHTML: pgeCant.description_short, contentTemplate: 'product_detail' });
});
/*
// Ruta para otras páginas
router.get('/:rutaDinamica', async (req, res) => {
  const pgeCont = await getPageByUrl(req.params.rutaDinamica);
  res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCont.title, contentHTML: pgeCont.content_html, contentTemplate: 'page' });
});
*/

module.exports = router;
