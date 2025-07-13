// lib/constants/footer-menu.ts

export interface FooterMenuItem {
    name: string;
    href: string;
}

export interface FooterMenuCategory {
    title: string;
    items: FooterMenuItem[];
}

export const footerMenuData: FooterMenuCategory[] = [
    {
        title: 'PRODUCTOS',
        items: [
            { name: 'Nuevos productos', href: '/productos/nuevos' },
            { name: 'Tiendas de campaña & Lonas', href: '/productos/mochilas' },
            { name: 'Artículos de viaje', href: '/productos/articulos-viaje' },
            { name: 'Sacos de dormir', href: '/productos/tiendas-campana' },
            { name: 'Cocina exterior', href: '/productos/cocina-exterior' },
            { name: 'Primeros auxilios', href: '/productos/primeros-auxilios' },
            { name: 'Accesorios para exteriores', href: '/productos/accesorios' },
        ]
    },
    {
        title: 'ACTIVIDADES',
        items: [
            { name: 'Trekking', href: '/actividades/trekking' },
            { name: 'Senderismo', href: '/actividades/senderismo' },
            { name: 'Camping', href: '/actividades/camping' },
            { name: 'Ciclismo', href: '/actividades/ciclismo' },
        ]
    },
    {
        title: 'ESPECIALES',
        items: [
            { name: 'Trekking', href: '/especiales/trekking' },
            { name: 'Backpacking', href: '/especiales/backpacking' },
            { name: 'Hiking', href: '/especiales/hiking' },
            { name: 'Bushcrafting', href: '/especiales/bushcrafting' },
            { name: 'Everyday', href: '/especiales/everyday' },
            { name: 'Colección Hike Pack', href: '/especiales/hike-pack' },
            { name: 'Colección Bushcraft', href: '/especiales/bushcraft' },
            { name: 'Acero inoxidable', href: '/especiales/acero-inoxidable' },
            { name: 'La nueva serie de viajes', href: '/especiales/serie-viajes' },
            { name: 'La colección de tiendas', href: '/especiales/coleccion-tiendas' },
            { name: 'El buscador de tiendas', href: '/especiales/buscador-tiendas' },
            { name: 'Sin miedo al robo de datos', href: '/especiales/seguridad-datos' },
        ]
    },
    {
        title: 'SERVICIO',
        items: [
            { name: 'Servicio de reparación', href: '/servicio/reparacion' },
            { name: 'Consejos para mochileros', href: '/servicio/consejos-mochileros' },
            { name: 'Primeros auxilios', href: '/servicio/primeros-auxilios' },
            { name: 'Consejos para la tienda', href: '/servicio/consejos-tienda' },
            { name: 'Materiales', href: '/servicio/materiales' },
            { name: 'Tabla de tallas', href: '/servicio/tallas' },
            { name: 'FAQ', href: '/servicio/faq' },
        ]
    },
    {
        title: 'LA COMPAÑÍA',
        items: [
            { name: 'La marca', href: '/compania/marca' },
            { name: 'Traceability by Tatonka', href: '/compania/traceability' },
            { name: 'Socio y fabricante', href: '/compania/socios' },
            { name: 'Socio colaborador', href: '/compania/colaboradores' },
            { name: 'Declaración sobre accesibilidad', href: '/compania/accesibilidad' },
            { name: 'Tatonka Community', href: '/compania/community' },

        ]
    }
];