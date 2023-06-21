// Requires (librerías de terceros o personalizadas)
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

// Importar modelo
var Hospital = require('../models/hospital');

// ==============================================
// Obtener todos los hospitales
// ==============================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .select("nombre usuario")
        .then((hospitales) => {

            Hospital.count({})
                .then((conteo, err) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                })

        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospital',
                errors: err
            });
        });
});

// ==============================================
// Actualizar hospital
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id)
        .then((hospital, err) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }

            hospital.nombre = body.nombre;
            hospital.usuario = req.usuario._id; // El usuario lo coge del token

            //Guardo
            hospital.save()
                .then((hospitalGuardado) => {
                    res.status(200).json({
                        ok: true,
                        hospital: hospitalGuardado
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                    });
                });

        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        });

});

// ==============================================
// Crear un nuevo hospital
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    // Se crea el hospital con lo que llegue en el body de la petición http
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id // El usuario lo coge del token
    });

    hospital.save()
        .then((hospitalGuardado) => {
            res.status(201).json({
                ok: true,
                hospital: hospitalGuardado
            });
        })
        .catch((err) => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        });

});

// ==============================================
// Borrar un hospital por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndDelete(id)
        .then((hospitalBorrado) => {
            if (!hospitalBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un hospital con ese id',
                    errors: { message: 'No existe un hospital con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                usuario: hospitalBorrado
            });
        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });

        });

});

// Para usarlo fuera necesito exportarlas
module.exports = app;