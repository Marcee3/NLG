export function protegerRuta( req, res, next) {
    if (!req.session || !req.session.vendedora) {
        return res.redirect('/auth/login');
    }

    next();

}

export const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.session.vendedora) {
            return res.redirect('/auth/pagPermisos');
        }
        const { rol } = req.session.vendedora;

        if (!rolesPermitidos.includes(rol)) {
            return res.redirect('/');
        }
        next();
    };
}