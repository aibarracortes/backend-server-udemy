// Requires (librerías de terceros o personalizadas)
var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs'); // no hay que importarlo de node, sólo esto

// Inicializar variables
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no válida' }
        });
    }

    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Extensiones aceptadas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // [id del usuario] + [-] + [número random] + [.] + [extensión]
    // El id de usuario evita que el nombre de la imagen entre en conflicto con el nombre de imagen de otro usuario
    // El número random ayuda a prevenir el caché de la imagen del navegador web
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path)
        .then(() => {

            subirPorTipo(tipo, id, nombreArchivo, res);

            /*
            res.status(200).json({
                ok: true,
                mensaje: 'Archivo movido',
                extensionArchivo: extensionArchivo
            });*/
        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {

        Usuario.findById(id)
            .then(usuario => {

                var pathViejo = './uploads/usuarios/' + usuario.img;

                // Si existe elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al borrar la imagen antigua',
                                errors: err
                            });
                        }
                    });
                }

                usuario.img = nombreArchivo;

                usuario.save()
                    .then((usuarioActualizado) => {

                        usuarioActualizado.password = ':)';
                        return res.status(200).json({
                            ok: true,
                            mensaje: 'Imagen de usuario actualizada',
                            usuario: usuarioActualizado
                        });

                    })
                    .catch((err) => {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al actualizar usuario',
                            errors: err
                        });
                    });
            })
            .catch(err => {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            });
    }

    if (tipo === 'medicos') {

        Medico.findById(id)
            .then(medico => {

                var pathViejo = './uploads/medicos/' + medico.img;

                // Si existe elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al borrar la imagen antigua',
                                errors: err
                            });
                        }
                    });
                }

                medico.img = nombreArchivo;

                medico.save()
                    .then((medicoActualizado) => {

                        return res.status(200).json({
                            ok: true,
                            mensaje: 'Imagen de médico actualizada',
                            medico: medicoActualizado
                        });

                    })
                    .catch((err) => {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al actualizar médico',
                            errors: err
                        });
                    });
            })
            .catch(err => {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Médico no existe',
                    errors: { message: 'Médico no existe' }
                });
            });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id)
            .then(hospital => {

                var pathViejo = './uploads/hospitales/' + hospital.img;

                // Si existe elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al borrar la imagen antigua',
                                errors: err
                            });
                        }
                    });
                }

                hospital.img = nombreArchivo;

                hospital.save()
                    .then((hospitalActualizado) => {

                        return res.status(200).json({
                            ok: true,
                            mensaje: 'Imagen de hospital actualizada',
                            hospital: hospitalActualizado
                        });

                    })
                    .catch((err) => {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al actualizar hospital',
                            errors: err
                        });
                    });
            })
            .catch(err => {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            });
    }
}

// Para usarlo fuera necesito exportarlas
module.exports = app;