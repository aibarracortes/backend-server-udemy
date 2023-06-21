// Requires (librerías de terceros o personalizadas)
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

// Importar modelo
var Medico = require('../models/medico');

// ==============================================
// Obtener todos los médicos
// ==============================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .select("nombre usuario hospital")
        .then((medicos) => {

            Medico.count({})
                .then((conteo, err) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                })

        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando médico',
                errors: err
            });
        });
});

// ==============================================
// Actualizar médico
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id)
        .then((medico, err) => {

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El médico con el id ' + id + ' no existe',
                    errors: { message: 'No existe un médico con ese ID' }
                });
            }

            medico.nombre = body.nombre;
            medico.usuario = req.usuario._id; // El usuario lo coge del token
            medico.hospital = body.hospital;

            //Guardo
            medico.save()
                .then((medicoGuardado) => {
                    res.status(200).json({
                        ok: true,
                        medico: medicoGuardado
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar médico',
                        errors: err
                    });
                });

        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar médico',
                errors: err
            });
        });

});

// ==============================================
// Crear un nuevo médico
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    // Se crea el hospital con lo que llegue en el body de la petición http
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id, // El usuario lo coge del token,
        hospital: body.hospital
    });

    medico.save()
        .then((medicoGuardado) => {
            res.status(201).json({
                ok: true,
                medico: medicoGuardado,
                usuarioToken: req.medico
            });
        })
        .catch((err) => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear médico',
                errors: err
            });
        });

});

// ==============================================
// Borrar un médico por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndDelete(id)
        .then((medicoBorrado) => {
            if (!medicoBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un médico con ese id',
                    errors: { message: 'No existe un médico con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                usuario: medicoBorrado
            });
        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar médico',
                errors: err
            });

        });

});

// Para usarlo fuera necesito exportarlas
module.exports = app;