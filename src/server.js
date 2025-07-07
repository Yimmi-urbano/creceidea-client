const express = require('express');
const path = require('path');
const compression = require('compression');
const routes = require('./routes');
const validateSubdomain = require('./domainValidator');
const { getConfig } = require('./functions');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

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
    new transports.Console(),
    new transports.File({ filename: 'server.log' })
  ]
});

const app = express();
const PORT = process.env.PORT || 5000;
const { DOMAIN_LOCAL } = process.env;

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1y' }));

app.use(compression());

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
      // res.status(403).send('Acceso no autorizado: ' + subdomain);
      res.status(403).render(path.join(__dirname, '../views', 'error_page'));

    }
  } catch (error) {
    logger.error('Error al validar el subdominio:', error);
    res.status(500).send('Error al validar el subdominio');
  }
});

const themeMiddleware = async (req, res, next) => {
  try {
    const domain = DOMAIN_LOCAL || req.hostname;
    const cacheExpirationTime = 5 * 60 * 1000;

    if (res.locals.theme && res.locals.domain === domain) {
      const currentTime = Date.now();
      if (currentTime - res.locals.themeTimestamp < cacheExpirationTime) {
        return next();
      }
    }

    const userConfig = await getConfig(domain);
    const theme = userConfig.theme;

    res.locals.theme = theme;
    res.locals.domain = domain;
    res.locals.themeTimestamp = Date.now();

    req.themePath = path.join(__dirname, '..', 'views', 'templates', theme);
    next();
  } catch (error) {
    logger.error('Error al obtener el tema del usuario:', error);
    next(error);
  }
};

app.use(themeMiddleware);

app.use((req, res, next) => {
  const originalRender = res.render;
  res.render = function (view, options, callback) {
    const viewPath = path.join(req.themePath, view);
    return originalRender.call(this, viewPath, options, callback);
  };
  next();
});

app.use('/', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
