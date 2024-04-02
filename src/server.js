// src/server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const ejs = require('ejs');
const {  fetchMenu } = require('./apiService');
const { getPageByUrl,getPageByIdProduct } = require('./functions')


const app = express();
const PORT = process.env.PORT || 3000;


app.set('views', path.join(__dirname, '..', 'views', 'templates', 'theme001'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));

app.get('/', async (req, res) => {
  try {
    const pgeCont = await getPageByUrl('/');
    res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCont.title, contentHTML: pgeCont.content_html ,  contentTemplate: 'home' });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).send('Error al obtener datos');
  }
});

app.get('/catalog/:rutaDinamica', async (req, res) => {
  try {
    const pgeCant = await getPageByIdProduct('/catalog/' + req.params.rutaDinamica);
    console.log(pgeCant);
    res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCant.title, contentHTML: pgeCant.description_short ,  contentTemplate: 'product_detail'});
  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    res.status(500).send('Error al manejar la solicitud');
  }
});

app.get('/:rutaDinamica', async (req, res) => {
  try {
    const pgeCont = await getPageByUrl(req.params.rutaDinamica);
    res.render('index', { menuOptions: await fetchMenu(), pageTitle: pgeCont.title, contentHTML: pgeCont.content_html ,contentTemplate: 'page'});
  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    res.status(500).send('Error al manejar la solicitud');
  }
});




app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
