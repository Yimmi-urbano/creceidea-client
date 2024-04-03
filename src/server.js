const express = require('express');
const path = require('path');
const ejs = require('ejs');
const compression = require('compression');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del motor de plantillas EJS
app.set('views', path.join(__dirname, '..', 'views', 'templates', 'theme001'));
app.set('view engine', 'ejs');

// Middleware de compresión de respuesta
app.use(compression());

// Habilitar la caché de vistas en Express
app.set('view cache', true);

// Rutas
app.use('/', routes);

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
