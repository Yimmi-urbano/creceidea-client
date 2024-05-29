const express = require('express');
const path = require('path');
const compression = require('compression');
const routes = require('./routes');
const validateSubdomain = require('./domainValidator');
const { fetchUserTheme } = require('./apiService');

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
    console.error('Error al validar el subdominio:', error);
    res.status(500).send('Error al validar el subdominio');
  }
});

// Middleware para obtener y configurar el tema del usuario
const themeMiddleware = async (req, res, next) => {
  try {
    const domain = DOMAIN_LOCAL || req.hostname;
    const userTheme = await fetchUserTheme(domain);
    const theme = userTheme;
    // Configurar la ruta de las vistas según el tema del usuario
    app.set('views', path.join(__dirname, '..', 'views', 'templates', theme));
    next();
  } catch (error) {
    console.error('Error al obtener el tema del usuario:', error);
    next(error);
  }
};

app.use(themeMiddleware);

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
