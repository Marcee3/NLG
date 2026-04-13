import Vendedora from "../models/Vendedoras.js";
//Página principal
const index = (req, res) => {
    res.render('index', {
        titulo: 'Novias Los Gatitos'
    });
};

//Pagina de registro
const registrarF = (req, res ) => {
    res.render('auth/registro', {
        titulo: 'Registrar usuario'
    })
};

//Página de login
const login = (req, res ) => {
    res.render('auth/login',{
        titulo: 'Iniciar sesión'
    })
};

//Página de agenda digital
const setup = (req, res) => {
    res.render('admin/setup', {
        titulo: 'Agenda Digital'
    });
};

//Página para agendar citas
const register = async(req, res) => {
    try {
        const vendedoras = await Vendedora.findAll();

        res.render('admin/register', {
            titulo: 'Agendar citas',
            vendedoras
        });

    } catch (error) {
        console.log(error);
    }
};

//Página para gestión de citas
const dates = async(req, res) => {
    try {
        const vendedoras = await Vendedora.findAll();

        res.render('admin/dates', {
            titulo: 'Revisar citas',
            vendedoras
        });

    } catch (error) {
        console.log(error);
    }
};

//Panel para cambiar usuarios
const panel = (req, res) => {
    res.render('admin/panel', {
        titulo: 'Configuración'
    });
};

//Formulario para cambiar la contrasena
const contraPag = (req, res) => {
    res.render('auth/contraPag', {
        titulo: 'Cambiar configuración'
    });
};

//Recuperacion de contrasena
const recuperar = (req, res) => {
    res.render('auth/recuperar', {
        titulo: 'Recuperar contrasena'
    });
};

//Páginas de error
const pageError = (req, res) => {
    res.render('error/pagError', {
        titulo:'Error 404'
    });
};

const pageServer = (req, res) => {
    res.render('error/pagServer', {
        titulo:'Error 500'
    });
};

const pagePermisos = (req, res) => {
    res.render('error/pagPermisos', {
        titulo: 'Sin permisos'
    })
}

export{
    index, login, registrarF, setup, register, dates, panel, contraPag, pageError, pageServer, recuperar, pagePermisos
}