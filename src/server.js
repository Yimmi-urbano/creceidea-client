const express = require('express');
require('dotenv').config();
const path = require('path');
const ejs = require('ejs');
const compression = require('compression');
const axios = require('axios');
const bodyParser = require('body-parser');
const routes = require('./routes');
const validateSubdomain = require('./domainValidator');
const { html_error } = require('./helpers');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 3000;
const DOMAIN_LOCAL = process.env.DOMAIN_LOCAL;
const themeCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

app.use(bodyParser.json());

async function getThemeConfig(subdomain) {
  const hostname = subdomain.split('.')[0];
  try {
    let theme = themeCache.get(subdomain);
    if (!theme) {
      const response = await axios.get(`https://api-configuration.creceidea.pe/api/configurations`, {
        headers: {
          'domain': hostname
        }
      });

      theme = (response.data[0]?.theme !== undefined) ? response.data[0].theme : 'theme001';

      themeCache.set(subdomain, theme);
    }
    return theme;
  } catch (error) {
    console.error('Error al obtener la configuración del tema:', error);
    throw error;
  }
}

app.use(async (err, req, res, next) => {
  if (err instanceof ThemeNotFoundError) {
    res.status(500).send('No se pudo determinar el tema para el subdominio');
  } else {
    next(err);
  }
});


app.use(async (req, res, next) => {
  try {
    const subdomain = DOMAIN_LOCAL ?? req.hostname;
    if (!subdomain) {
      return res.status(403).send('No se proporcionó ningún subdominio');
    }
    const isValid = await validateSubdomain(subdomain);
    if (isValid) {
      const theme = await getThemeConfig(subdomain);
      if (theme) {
        app.set('views', path.join(__dirname, '..', 'views', 'templates', theme));
      } else {
        throw new ThemeNotFoundError();
      }
      next();
    } else {
      res.status(403).send('Acceso no autorizado: ' + subdomain);
    }
  } catch (error) {
    console.error('Error al validar el subdominio o establecer el tema:', error);
    next(error);
  }
});


class ThemeNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ThemeNotFoundError';
  }
}


app.post('/invalidate-cache', (req, res) => {
  const { subdomain } = req.body;
  if (subdomain) {
    themeCache.del(subdomain);
    res.send(`Caché invalidada para el subdominio ${subdomain}`);
  } else {
    res.status(400).send('Subdominio no proporcionado');
  }
});


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(compression());
app.use('/', routes);

app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(500).send(html_error());
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
