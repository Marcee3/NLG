//Catalogos de Vestidos
const catalogoXV = (req, res) => {
    const imagenes = [
            '/img/XV/VX-324-PQ1072-RS-LG-J1790X(1).jpeg',
            '/img/XV/VX-098-FRN8419-RO-08-J3090X(1).jpeg',
            '/img/XV/VX-324-PQ1072-RS-LG-J1790X(1).jpeg',
        ];
    res.render('user/catalogoXV', {
        titulo:'Catalogo de XV',
        imagenes
    });
};

const catalogoVN = (req, res) => {
    const imagenes = [
            '/img/VN/VN-123-048-IV-14(1).jpeg',
            '/img/VN/VN-123-557-IV-10(1).jpeg',
            '/img/VN/VN-123-AVA-061-IV-08(1).jpeg'
        ];
    res.render('user/catalogoVN', {
        titulo:'Catalogo de Novia',
        imagenes
    });
};

export{
    catalogoVN,
    catalogoXV
}