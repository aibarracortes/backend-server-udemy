// Requires (librerías de terceros o personalizadas)
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

// Importar modelo
var Usuario = require('../models/usuario');
//const usuario = require('../models/usuario');

// ==============================================
// Obtener todos los usuarios
// ==============================================
app.get('/', (req, res, next) => {
    Usuario.find({})
        .select("nombre email img role")
        .then((usuarios) => {
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuario',
                errors: err
            });
        });
});

// ==============================================
// Actualizar usuario
// ==============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id)
        .then((usuario, err) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id ' + id + ' no existe',
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }

            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;

            //Guardo
            usuario.save()
                .then((usuarioGuardado) => {
                    usuarioGuardado.password = ':)';
                    res.status(200).json({
                        ok: true,
                        usuario: usuarioGuardado
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                });

        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        });

});

// ==============================================
// Crear un nuevo usuario
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    // Se crea el usuario con lo que llegue en el body de la petición http
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save()
        .then((usuarioGuardado) => {
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });
        })
        .catch((err) => {
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        });

});

// ==============================================
// Borrar un usuario por el id
// ==============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndDelete(id)
        .then((usuarioBorrado) => {
            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un usuario con ese id',
                    errors: { message: 'No existe un usuario con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });
        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });

        });

});

// Para usarlo fuera necesito exportarlas
module.exports = app;