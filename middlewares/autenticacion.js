var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ==============================================
// Verificar token
// ----------------------------------------------
exports.verificaToken = function(req, res, next) {
    var token = req.query.token; // llegará por el url, algo así... '/:token'

    if (!token) {
        res.status(401).json({
            ok: false,
            mensaje: 'No se recibió ningún token'
        });
    }

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();
        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });
    });
}