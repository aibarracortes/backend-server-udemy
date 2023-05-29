// Requires (librerías de terceros o personalizadas)
var express = require('express');
const mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conexión a la DB
/*mongoose.connection.openUri('mongodb://127.0.0.1:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});*/
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/hospitalDB');
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
}

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});