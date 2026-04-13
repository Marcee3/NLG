import { check, validationResult } from "express-validator";
import {nanoid} from 'nanoid'; //Para la creación de token
import bcrypt from 'bcrypt'; // Para la encriptación de contraseña
import {enviarEmailConfirmacion, enviarEmailRecuperacion} from "../services/registroEmail.js";//Para el envío de email de confirmación
import Vendedora from "../models/Vendedoras.js";

const registrarVendedora = async(req, res) => {

    await check('nombreVendedora').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('telefonoVendedora').notEmpty().withMessage('El telefono no puede ir vacío').run(req);
    await check('correo').isEmail().notEmpty().withMessage('El email no puede ir vacío').run(req);
    await check('contrasena').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres').run(req);

    await check('confirmar').custom((value, {req})=>{
        if(value !== req.body.contrasena){
            throw new Error('Las contraseñas no coinciden');
        }
        return true;
    }).run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.render('auth/registro',{
            titulo: 'Registrar usuario',
            errores: resultado.array(),
            vendedora: {
                nombreVendedora: req.body.nombreVendedora,
                telefonoVendedora: req.body.telefonoVendedora,
                correo: req.body.correo
            }
        });
    }

    const existeUsuario = await Vendedora.findOne({where: {correo: req.body.correo}});
    if(existeUsuario){
        return res.render('auth/registro',{
            titulo: 'Registrar usuario',
            errores: [{msg: "La vendedora ya está registrada"}],
            vendedora: {
                nombreVendedora: req.body.nombreVendedora,
                telefonoVendedora: req.body.telefonoVendedora,
                correo: req.body.correo
            }
        });
    }

    // 🔐 Encriptar password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.contrasena, salt);

    // Token
    const token = nanoid();

    // Crear usuario
    await Vendedora.create({
        nombreVendedora: req.body.nombreVendedora,
        telefonoVendedora: req.body.telefonoVendedora,
        correo: req.body.correo,
        contrasena: hashPassword,
        token: token,
        confirmado: 0
    });

    try {
        console.log("📧 Intentando enviar correo...");

        await enviarEmailConfirmacion({
            nombreVendedora: req.body.nombreVendedora,
            email: req.body.correo,
            url: `http://${req.headers.host}/auth/confirmar/${token}`
        });

        console.log("✅ Correo enviado");

        return res.render('auth/registro', {
            titulo: 'Cuenta creada correctamente',
            mensaje: 'Revisa tu correo para confirmar tu cuenta'
        });

    } catch(error){
        console.log("❌ ERROR CORREO:", error);

        return res.render('auth/registro', {
            titulo: 'Error',
            errores: [{ msg: "Usuario creado pero no se pudo enviar el correo" }],
            vendedora: {
                nombreVendedora: req.body.nombreVendedora,
                correo: req.body.correo
            }
        });
    }
}

// Confirmar usuario con token
const confirmar = async (req, res) => {
    const { token } = req.params;
    // Buscar usuario con ese token
    const vendedora = await Vendedora.findOne({ where: { token } });
    // Si no existe usuario con ese token
    if (!vendedora) {
        return res.render('auth/confirmar-cuenta', {
            titulo: 'Error al confirmar',
            mensaje: 'Token no válido',
            error: true
        });
    }

    // Confirmar usuario
    vendedora.token = null;
    vendedora.confirmado = true;
    await vendedora.save();

    res.render('auth/confirmar-cuenta', {
        titulo: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmó correctamente.'
    });
};

//SESIONES
const login = async (req, res) => {
    try {
        // Validar que req.body existe
        if (!req.body) {
            return res.render('auth/login', {
                titulo: 'Iniciar sesión',
                errores: [{ msg: "Formulario incompleto" }],
            });
        }

        // Desestructurar con valores por defecto para evitar errores
        const { correo = '', contrasena = '' } = req.body;

        if (!correo || !contrasena) {
            return res.render('auth/login', {
                titulo: 'Iniciar sesión',
                errores: [{ msg: "Debes ingresar correo y contraseña" }],
            });
        }

        // Buscar al usuario
        const vendedora = await Vendedora.findOne({ where: { correo } });

        // Verificar si existe
        if (!vendedora) {
            return res.render('auth/login', {
                titulo: 'Iniciar sesión',
                errores: [{ msg: "No existe un usuario con ese correo electrónico" }],
            });
        }

        // Validar si confirmó su cuenta
        if (!vendedora.confirmado) {
            return res.render('auth/login', {
                titulo: 'Iniciar sesión',
                errores: [{ msg: "Debes confirmar tu cuenta" }],
            });
        }

        // Verificar contraseña
        const contrasenaCorrecta = await bcrypt.compare(contrasena, vendedora.contrasena);
        if (!contrasenaCorrecta) {
            return res.render('auth/login', {
                titulo: 'Iniciar sesión',
                errores: [{ msg: "La contraseña es incorrecta" }],
            });
        }

        // Guardar sesión y redirigir
        req.session.vendedora = vendedora;
        return res.redirect('/admin/setup');

    } catch (error) {
        console.log("❌ ERROR LOGIN:", error);
        return res.render('auth/login', {
            titulo: 'Iniciar sesión',
            errores: [{ msg: "Ocurrió un error inesperado. Intenta de nuevo." }],
        });
    }
};

//Cerrar la sesión y redirigir al index
const cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

//Cambiar contrasena
const cambiarContrasena = async (req, res) => {
  try {
    const { oldContrasena, newContrasena, confirmarContrasena } = req.body;

    // Verificar que exista sesión
    if (!req.session.vendedora) {
      return res.redirect('/login');
    }

    // Buscar vendedora por id
    const vendedora = await Vendedora.findByPk(req.session.vendedora.id_Vendedora);
    if (!vendedora) {
      return res.render('auth/contraPag', { error: "Usuario no encontrado" });
    }

    // Validar contraseña actual
    const passCorrecta = await bcrypt.compare(oldContrasena, vendedora.contrasena);
    if (!passCorrecta) {
      return res.render('auth/contraPag', { error: "Contraseña actual incorrecta" });
    }

    // Validar que las nuevas contraseñas coincidan
    if (newContrasena !== confirmarContrasena) {
      return res.render('auth/contraPag', { error: "Las nuevas contraseñas no coinciden" });
    }

    // Hashear nueva contraseña
    const hash = await bcrypt.hash(newContrasena, 10);
    vendedora.contrasena = hash;
    await vendedora.save();

    res.render('auth/contraPag', { mensaje: "Contraseña cambiada correctamente" });
  } catch (error) {
    console.error(error);
    res.render('auth/contraPag', { error: "Ocurrió un error al cambiar la contraseña" });
  }
};

//Recuperar contrasena
const solicitarRecuperacion = async (req, res) => {
    const {correo} = req.body;
    const vendedora = await Vendedora.findOne({ where: { correo } });
    if (!vendedora) {
    return res.render('auth/recuperar', { error: 'Correo no registrado' });
  }
    const token = nanoid(32); // token único
    const expiracion = new Date(Date.now() + 3600000); // 1 hora
    vendedora.token_recuperacion = token;
    vendedora.token_expiracion = expiracion;
    await vendedora.save();

      const url = `http://${req.headers.host}/recuperar/${token}`;

      await enviarEmailRecuperacion(vendedora.correo, url);
  res.render('auth/recuperar', { mensaje: 'Se envió un correo para restablecer tu contraseña' });
};

const formularioNuevaContrasena = async (req, res) => {
  const { token } = req.params;
  const vendedora = await Vendedora.findOne({ where: { token_recuperacion: token } });

  if (!vendedora || vendedora.token_expiracion < new Date()) {
    return res.render('auth/recuperar', { error: 'Token inválido o expirado' });
  }

  // Renderiza la vista correcta con título y token
  res.render('auth/nuevaContrasena', { 
      titulo: 'Restablecer Contraseña', 
      token, 
      mensaje: null, 
      error: null 
  })
};

const cambiarContrasenaRecuperacion = async (req, res) => {
  const { token, newContrasena, confirmarContrasena } = req.body;

  const vendedora = await Vendedora.findOne({ where: { token_recuperacion: token } });

  if (!vendedora || vendedora.token_expiracion < new Date()) {
    return res.render('auth/recuperar', { error: 'Token inválido o expirado' });
  }

  if (newContrasena !== confirmarContrasena) {
    return res.render('auth/nuevaContrasena', { 
    titulo: 'Restablecer Contraseña',
    token,
    error: 'Las contraseñas no coinciden'
});
  }

  const hash = await bcrypt.hash(newContrasena, 10);
  vendedora.contrasena = hash;

    // Invalidar token
  vendedora.token_recuperacion = null;
  vendedora.token_expiracion = null;

  await vendedora.save();

  res.render('auth/login', { mensaje: 'Contraseña cambiada correctamente' });
}

export{
    registrarVendedora, confirmar, login, cerrarSesion, cambiarContrasena, solicitarRecuperacion, formularioNuevaContrasena, cambiarContrasenaRecuperacion
}