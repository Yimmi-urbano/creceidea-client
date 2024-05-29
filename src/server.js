const express = require('express');
const path = require('path');
const compression = require('compression');
const routes = require('./routes');
const validateSubdomain = require('./domainValidator');
const { fetchUserTheme } = require('./apiService');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Configuración de Winston
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(), // Log en la consola
    new transports.File({ filename: 'server.log' }) // Log en un archivo
  ]
});

const app = express();
const PORT = process.env.PORT || 3000;
const { DOMAIN_LOCAL } = process.env;

// Configurar el motor de plantillas a EJS
app.set('view engine', 'ejs');

// Middleware para servir archivos estáticos con caché de 1 año
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1y' }));

// Middleware para comprimir las respuestas
app.use(compression());

// Middleware para validar el subdominio
app.use(async (req, res, next) => {
  try {
    const subdomain = DOMAIN_LOCAL || req.hostname;
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
    logger.error('Error al validar el subdominio:', error);
    res.status(500).send('Error al validar el subdominio');
  }
});

// Middleware para obtener y configurar el tema del usuario
const themeMiddleware = async (req, res, next) => {
  try {

    const domain = DOMAIN_LOCAL || req.hostname;
    const userTheme = await fetchUserTheme(domain);
    const theme = userTheme;
    req.themePath = path.join(__dirname, '..', 'views', 'templates', theme);
    next();
  } catch (error) {
 
    next(error);
  }
};

app.use(themeMiddleware);

// Sobrescribir res.render para usar la ruta de vista del tema del usuario
app.use((req, res, next) => {
  const originalRender = res.render;
  res.render = function(view, options, callback) {
    const viewPath = path.join(req.themePath, view);

    return originalRender.call(this, viewPath, options, callback);
  };
  next();
});

// Rutas principales de la aplicación
app.use('/', routes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
