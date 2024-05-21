const express = require('express');
const path = require('path');
const ejs = require('ejs');
const compression = require('compression');
const routes = require('./routes');
const validateSubdomain = require('./domainValidator');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '..', 'views', 'templates', 'theme001'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', async (req, res, next) => {
  try {
    const subdomain = req.hostname;
    if (!subdomain) {
      return res.status(403).send('No se proporcionó ningún subdominio');
    }
    const isValid = await validateSubdomain(subdomain);
    if (isValid) {
      next();
    } else {
      res.status(403).send('Acceso no autorizado: ' + subdomain);
    }
  } catch (error) {
    console.error('Error al validar el subdominio:', error);
    res.status(500).send('Error al validar el subdominio');
  }
});

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});