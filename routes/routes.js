import express from 'express';
import {index, registrarF, setup, register, dates, panel, contraPag, pageError, pageServer, recuperar, pagePermisos} from '../controllers/controller.js';
import {catalogoVN, catalogoXV} from '../controllers/catalogoController.js';
import {getCitas, saveCitas, deleteCitas, updateCitas} from '../controllers/citasController.js';
import { protegerRuta, verificarRol} from '../middlewares/protegerRuta.js';
import {registrarVendedora, confirmar, login, cerrarSesion, cambiarContrasena, solicitarRecuperacion, formularioNuevaContrasena, cambiarContrasenaRecuperacion} from '../controllers/authController.js';

const router = express.Router();

//Vistas de la app
//Superadmin
router.get('/panel', protegerRuta, verificarRol(['superadmin']), panel);

//Admin
router.get('/register', protegerRuta, verificarRol(['superadmin', 'admin']), register); //Agendar citas

//Editor
router.get('/setup', protegerRuta, verificarRol(['superadmin', 'admin', 'editor']), setup);
router.get('/dates', protegerRuta, verificarRol(['superadmin', 'admin','editor']), dates); //Visualizar citas agendadas

//Usuario
router.get('/', index);

//Catalogos
router.get('/catalogoXV', catalogoXV);
router.get('/catalogoVN', catalogoVN);

//Ruta para confirmar token
router.get('/confirmar/:token', confirmar);

//Ruta para cerrar sesión
router.get('/logout', protegerRuta, cerrarSesion);

//Cambio de contraseña
router.get('/contraPag', protegerRuta, contraPag);
router.post('/contraPag', protegerRuta, cambiarContrasena);

//Recuperación de contraseña
router.get('/recuperar', recuperar); //Vista de pug
router.post('/recuperar', solicitarRecuperacion); //Enviar correo
router.get('/recuperar/:token', formularioNuevaContrasena);
router.post('/recuperar/:token', cambiarContrasenaRecuperacion);

//Autenticación
router.get('/registrar', registrarF);
router.post('/registro', registrarVendedora);
router.get('/login', login);
router.post('/login', login);


//Rutas de errores
router.get('/error', pageError);
router.get('/errorServer', pageServer);
router.get('/pagPermisos', pagePermisos);

router.get('/api/citas', getCitas);
router.post('/api/citas', saveCitas);
router.delete('/api/citas/:id', deleteCitas);
router.put('/api/citas/:id', updateCitas);

export default router;