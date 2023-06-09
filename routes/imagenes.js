// Requires (librerías de terceros o personalizadas)
var express = require('express');

// Inicializar variables
var app = express();

// No necesita instalación, ya viene con node
const path = require('path');
const fs = require('fs');

// Rutas
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImagen);
    }

});

// Para usarlo fuera necesito exportarlas
module.exports = app;