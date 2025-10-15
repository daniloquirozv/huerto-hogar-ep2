import mielImg from '../assets/images/principal/Miel-organica.png';
import platanosImg from '../assets/images/principal/Platanos-cavendish.png';
import lecheImg from '../assets/images/principal/Leche-natural.png';

export const productosMasVendidos = [
    {
        codigo: "PO001",
        nombre: "Miel Orgánica",
        precio: 5000,
        unidad: "frasco 500g",
        stock: 50,
        categoria: "Productos Orgánicos",
        descripcion: "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
        imagen: mielImg
    },
    {
        codigo: "FR003",
        nombre: "Plátanos Cavendish",
        precio: 800,
        unidad: "kg",
        stock: 250,
        categoria: "Frutas Frescas",
        descripcion: "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
        imagen: platanosImg
    },
    {
        codigo: "PL002",
        nombre: "Leche fresca",
        precio: 3800,
        unidad: "frasco 1LT",
        stock: 100,
        categoria: "Productos Lácteos",
        descripcion: "Leche fresca de granjas en la Región de O'Higgins, ricas en calcio y nutrientes. Con sabor auténtico y natural, perfectos para disfrutar en cualquier momento y cuidar a tu familia.",
        imagen: lecheImg
    }
];
