// Importar imágenes
import manzanasImg from '../assets/images/Productos/Manzanas-Fuji.png'
import naranjasImg from '../assets/images/Productos/Naranjas-valencia.png'
import platanosImg from '../assets/images/Productos/Platanos-cavendish.png'
import zanahoriasImg from '../assets/images/Productos/Zanahorias-organicas.png'
import espinacasImg from '../assets/images/Productos/Espinacas-frescas.png'
import pimientosImg from '../assets/images/Productos/Pimientos-tricolores.png'
import mielImg from '../assets/images/Productos/Miel-organica.png'
import quinoaImg from '../assets/images/Productos/Quinoa-organica.png'
import yogurtImg from '../assets/images/Productos/Yogurt-natural.png'
import lecheImg from '../assets/images/Productos/Leche-natural.png'

export const productos = [
    // Frutas Frescas
    {
        codigo: "FR001",
        nombre: "Manzanas Fuji",
        precio: 1200,
        unidad: "kg",
        stock: 150,
        categoria: "Frutas Frescas",
        descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
        imagen: manzanasImg
    },
    {
        codigo: "FR002",
        nombre: "Naranjas Valencia",
        precio: 1000,
        unidad: "kg",
        stock: 200,
        categoria: "Frutas Frescas",
        descripcion: "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
        imagen: naranjasImg
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
    // Verduras
    {
        codigo: "VR001",
        nombre: "Zanahorias orgánicas",
        precio: 900,
        unidad: "kg",
        stock: 100,
        categoria: "Verduras",
        descripcion: "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.",
        imagen: zanahoriasImg
    },
    {
        codigo: "VR002",
        nombre: "Espinacas Frescas",
        precio: 700,
        unidad: "bolsa",
        stock: 80,
        categoria: "Verduras",
        descripcion: "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
        imagen: espinacasImg
    },
    {
        codigo: "VR003",
        nombre: "Pimientos tricolores",
        precio: 1500,
        unidad: "kg",
        stock: 120,
        categoria: "Verduras",
        descripcion: "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.",
        imagen: pimientosImg
    },
    // Productos Orgánicos
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
        codigo: "PO002",
        nombre: "Quinoa orgánica",
        precio: 4500,
        unidad: "paquete 500g",
        stock: 100,
        categoria: "Productos Orgánicos",
        descripcion: "Quinoa orgánica, natural y libre de químicos, rica en proteínas y fibra. Ideal para una alimentación saludable y nutritiva, perfecta para toda la familia.",
        imagen: quinoaImg
    },
    // Productos Lácteos
    {
        codigo: "PL001",
        nombre: "Yogurt natural",
        precio: 2000,
        unidad: "frasco 250g",
        stock: 80,
        categoria: "Productos Lácteos",
        descripcion: "Yogurt natural elaborado con leche fresca de granjas locales, fermentado con cultivos lácticos que le confieren su textura cremosa y sabor auténtico. Rico en probióticos, calcio y nutrientes esenciales.",
        imagen: yogurtImg
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
