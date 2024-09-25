var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Configuración de middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Manejo de errores 404 (ruta no encontrada)
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores generales
app.use(function(err, req, res, next) {
  // Solo en modo de desarrollo muestra detalles del error
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

// Exporta la app para ser utilizada por Vercel
module.exports = app;
