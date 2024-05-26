const express = require('express');
const path = require('path');
const ejs = require('ejs');
const compression = require('compression');
const helmet = require('helmet');
const routes = require('./routes');
const validateSubdomain = require('./domainValidator');
const { fetchUserTheme } = require('./apiService');

const app = express();
const PORT = process.env.PORT || 3000;
const { DOMAIN_LOCAL } = process.env;

app.set('view engine', 'ejs');

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1y' }));

// Middleware de compresión
app.use(compression());

// Middleware de seguridad con Helmet
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

// Middleware para configurar el tema del usuario
const themeMiddleware = async (req, res, next) => {
  try {
    const domain = DOMAIN_LOCAL || req.hostname;
    const userTheme = await fetchUserTheme(domain);
    const theme = userTheme || 'theme002';
    app.set('views', path.join(__dirname, '..', 'views', 'templates', theme));
    next();
  } catch (error) {
    next(error);
  }
};


// Aplica el middleware del tema antes de las rutas
app.use(themeMiddleware);

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
