import express from 'express';
import session  from 'express-session';
import routes from './routes/routes.js';
import db from './settings/db.js';
import './models/relaciones.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Sesion
app.use(session({
    secret: 'nlgcontra', //Para cifrar la información de la sesión
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true si usas HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 día
    }
}));

//Motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

//Carpeta publica
app.use(express.static('./public'));

app.use('/', routes);
app.use('/admin', routes);
app.use('/auth', routes);
app.use('/error', routes);
app.use('/user', routes);

//Conectar a la base de datos
try {
    await db.authenticate();
    db.sync(); //Sincronizar la base de datos
    console.log('Conexión correcta a la base de datos');
} catch (error) {
    console.error('Error de conexión: ', error);
    process.exit(1);
}

//Servidor
const port = 3005;
app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto http://localhost:${port}`);
});

