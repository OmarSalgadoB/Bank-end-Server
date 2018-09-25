//requires   son importaciones de 3 o personalidas es para que funcione algo
var express = require('express');
var moongose = require('mongoose');
var bodyParser = require('body-parser');
//inicializar variables aki es donde usamos esa librea

var app = express();

//body Parse

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


//conexion a la base de datos
moongose.connection.openUri('mongodb://localhost:27017/hospitaDB', (err, res) => {
        //cons esta instrucion validamos que si no conecta a la base de datos o algo sale mal pare todo
        if (err) throw err;
        console.log('Conexion a MongoDB exitosa');
    })
    //server index  config

var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

//impotar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuarios');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospitales');
var medicoRoutes = require('./routes/medicos');
var busquedaRoutes = require('./routes/busqueda');
var uploadsRoutes = require('./routes/uploads');
var imgRoutes = require('./routes/imagenes');
//rutas
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/uploads', uploadsRoutes);
app.use('/img', imgRoutes);
app.use('/', appRoutes);

//eschuchar peticiones

app.listen(3000, () => { //usamos la varibale y con listen lo ponemos a la eschucha en el puerto 3000
    console.log('Servidor express arrba online');
});
//creamos una fucnion de flecha para  que nos mande un mensaje por consola