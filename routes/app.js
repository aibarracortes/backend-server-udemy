// Requires (librerías de terceros o personalizadas)
var express = require('express');

// Inicializar variables
var app = express();

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

// Para usarlo fuera necesito exportarlas
module.exports = app;