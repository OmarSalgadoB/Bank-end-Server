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

//impotar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuarios');
var loginRoutes = require('./routes/login');
//rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//eschuchar peticiones

app.listen(3000, () => { //usamos la varibale y con listen lo ponemos a la eschucha en el puerto 3000
    console.log('Servidor express arrba online');
});
//creamos una fucnion de flecha para  que nos mande un mensaje por consola