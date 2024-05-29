const express = require('express');
const path = require('path');
const compression = require('compression');
const routes = require('./routes');
const validateSubdomain = require('./domainValidator');
const { fetchUserTheme } = require('./apiService');

const app = express();
const PORT = process.env.PORT || 3000;
const { DOMAIN_LOCAL } = process.env;

app.set('view engine', 'ejs');

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1y' }));


app.use(compression());

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

const themeMiddleware = async (req, res, next) => {
  try {
    const domain = DOMAIN_LOCAL || req.hostname;
    console.log('midel', domain)
    const userTheme = await fetchUserTheme(domain);
    const theme = userTheme || 'theme001';
    app.set('views', path.join(__dirname, '..', 'views', 'templates', theme));
    next();
  } catch (error) {
    next(error);
  }
};



app.use(themeMiddleware);

app.use('/', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
