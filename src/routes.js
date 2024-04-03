const express = require('express');
const router = express.Router();
const { fetchCatalogo, fetchMenu } = require('./apiService');
const { getPageByUrl, getPageByIdProduct } = require('./functions');

router.get('/', async (req, res) => {
  try {
    const pgeCont = await getPageByUrl('/');
    res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCont.title, contentHTML: pgeCont.content_html ,  contentTemplate: 'home' });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).send('Error al obtener datos');
  }
});

router.get('/catalog', async (req, res) => {
  try {
    console.log(await fetchCatalogo());
    res.render('index', { listCatalog: await fetchCatalogo(), menuOptions: await fetchMenu(), pageTitle: 'Servicios', contentHTML: 'Pagina de lista de servicios' ,  contentTemplate: 'catalog'});
  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    res.status(500).send('Error al manejar la solicitud');
  }
});

router.get('/catalog/:rutaDinamica', async (req, res) => {
  try {
    const pgeCant = await getPageByIdProduct('/catalog/' + req.params.rutaDinamica);
    console.log(pgeCant);
    res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCant.title, contentHTML: pgeCant.description_short ,  contentTemplate: 'product_detail'});
  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    res.status(500).send('Error al manejar la solicitud');
  }
});

router.get('/:rutaDinamica', async (req, res) => {
  try {
    const pgeCont = await getPageByUrl(req.params.rutaDinamica);
    res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCont.title, contentHTML: pgeCont.content_html ,contentTemplate: 'page'});
  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    res.status(500).send('Error al manejar la solicitud');
  }
});

module.exports = router;
