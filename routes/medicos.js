var express = require('express');
var app = express();
var Medico = require('../models/medico'); //importamos el modelo de la bd
var jwt = require('jsonwebtoken'); //para generar un token
var middleware = require('../moddlewares/autenticacion'); //lo impotamos para usar la funcion
// ==========================================
// Obtener todos los hospitales
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; //guardamos en una varible la catidad de registros si no viene
    //la igualamos a 0
    desde = Number(desde); //seimpre la convertimos a tipo numerica
    Medico.find({})
        .skip(desde) //para ir solicitado de 5 en 5
        .limit(7)
        .populate('usuario', 'nombre email')
        .populate('hospital') //si no le pasamos el segundo parametro envia todo
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        medicos: medicos
                    });
                });



            });
});


// ==========================================
// Actualizar Hospital
// ==========================================
app.put('/:id', middleware.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medicos) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!medicos) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }


        medicos.nombre = body.nombre;
        medicos.usuario = req.usuario._id;
        medicos.hospital = body.hospital;

        medicos.save((err, medicosGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: medicosGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo hospital
// ==========================================
app.post('/', middleware.verificatoken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            Medico: medicoGuardado
        });


    });

});


// ============================================
//   Borrar un hospital por el id
// ============================================
app.delete('/:id', middleware.verificatoken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar hospital',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});


module.exports = app;
//para poder esxport