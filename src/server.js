const express = require('express');
const path = require('path');
const ejs = require('ejs');
const compression = require('compression');
const helmet = require('helmet');
const routes = require('./routes');
const validateSubdomain = require('./domainValidator');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '..', 'views', 'templates', 'theme001'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1y' }));

// Agregar middleware de compresión
app.use(compression());

// Agregar middleware de seguridad con Helmet
/*
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https://storage.googleapis.com"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    frameAncestors: ["'self'"],
    upgradeInsecureRequests: []
  }
}));
*/
// Middleware para validar subdominio
app.use(async (req, res, next) => {
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

// Rutas
app.use('/', routes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
