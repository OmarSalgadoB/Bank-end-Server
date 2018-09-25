var express = require('express');
var app = express();
const path = require('path');
//este path ya viene con node 
var fs = require('fs');
//para usar el file system crear archivos moverlos etc...
app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    //guardamos en una varible la ruta absoluta de la imgen y le concatenamos el tipo y la img
    //_dirname no da la ruta absoluta c:// por ejemplo
    if (fs.existsSync(pathImagen)) { //si la imagen existe
        res.sendFile(pathImagen); //enviala en la respuesta
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        //guradmos en un path la ruta de cuando no tiene imagen
        res.sendFile(pathNoImage);
        // se la enviamos en la respuesta
    }
})
module.exports = app;