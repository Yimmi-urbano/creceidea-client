const express = require('express');
const path = require('path');
const ejs = require('ejs');
const compression = require('compression');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '..', 'views', 'templates', 'theme001'));
app.set('view engine', 'ejs');

app.use(compression());

const cache = new Map();

app.use((req, res, next) => {
  const key = req.originalUrl || req.url;
  const cachedContent = cache.get(key);
  if (cachedContent) {
    res.send(cachedContent);
    return;
  }
  res.sendResponse = res.send;
  res.send = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };
  next();
});


app.use('/', routes);

app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
