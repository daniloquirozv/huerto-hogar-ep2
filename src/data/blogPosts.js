import image from '../assets/images/principal/Comunidad.png';
import descuento from '../assets/images/principal/FondoDescuento.png'
import sale from '../assets/images/principal/descuento50.png'
import remate from '../assets/images/principal/remate.png'
export const blogPosts = [
    {
        id: 1,
        titulo: "¡OFERTA ESPECIAL! 30% OFF en Verduras Orgánicas",
        categoria: "Promociones",
        fecha: "2025-10-10",
        autor: "Equipo HuertoHogar",
        imagen: descuento,
        resumen: "¡Aprovecha nuestra súper oferta en verduras orgánicas! Descuentos de hasta 30% en zanahorias, espinacas, pimientos y más.",
        contenido: `
            <div class="promocion-destacada">
                <h3>🥬¡Verduras Frescas con 30% de Descuento!🥕</h3>
                <p>Esta semana tenemos una promoción especial en nuestras verduras orgánicas más populares:</p>
                <ul>
                    <li><strong>Pimientos tricolores:</strong> Antes $1.500/kg - Ahora $1.050/kg</li>
                    <li><strong>Zanahorias orgánicas:</strong> Antes $900/kg - Ahora $630/kg</li>
                    <li><strong>Espinacas frescas:</strong> Antes $700/kg - Ahora $490/kg</li>
                </ul>
                <div class="cupon-descuento">
                    <h4>🎟️ Cupón: VERDURAS30</h4>
                    <p>Usa el código <strong>VERDURAS30</strong> al hacer tu pedido</p>
                    <small>*Válido hasta el 17 de Octubre de 2025</small>
                </div>
            </div>
        `,
        descuento: 30,
        codigoCupon: "VERDURAS30",
        fechaVencimiento: "2025-10-17",
        destacado: true
    },
    {
        id: 2,
        titulo: "Frutas de Temporada: Lo Mejor del Otoño 2025",
        categoria: "Consejos",
        fecha: "2025-10-08",
        autor: "María González",
        imagen: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=400&fit=crop",
        resumen: "Descubre las mejores frutas de otoño y cómo aprovechar al máximo sus beneficios nutricionales.",
        contenido: `
            <h3>🍎 Las Mejores Frutas de Otoño</h3>
            <p>El otoño nos trae una variedad increíble de frutas llenas de vitaminas y antioxidantes:</p>
            <h4>Frutas Destacadas:</h4>
            <ul>
                <li><strong>Manzanas:</strong> Ricas en fibra y vitamina C</li>
                <li><strong>Peras:</strong> Excelente fuente de potasio</li>
                <li><strong>Granadas:</strong> Llenas de antioxidantes</li>
                <li><strong>Caquis:</strong> Alto contenido en vitamina A</li>
            </ul>
            <div class="oferta-especial">
                <h4>🍓 Oferta Especial de la Semana</h4>
                <p><strong>20% OFF en frutas de temporada</strong> - Código: <code>OTOÑO20</code></p>
            </div>
        `,
        descuento: 20,
        codigoCupon: "OTOÑO20",
        fechaVencimiento: "2025-10-15",
        destacado: false
    },
    {
        id: 3,
        titulo: "Cómo Crear tu Huerto Urbano en Casa",
        categoria: "Tutoriales",
        fecha: "2025-10-05",
        autor: "Carlos Martínez",
        imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
        resumen: "Guía completa para principiantes que quieren empezar su propio huerto urbano en espacios pequeños.",
        contenido: `
            <h3>🌱 Tu Primer Huerto Urbano</h3>
            <p>Crear un huerto en casa es más fácil de lo que piensas. Te guiamos paso a paso:</p>
            <h4>Paso 1: Elige el Lugar Adecuado</h4>
            <ul>
                <li>Mínimo 6 horas de sol directo</li>
                <li>Acceso fácil al agua</li>
                <li>Protegido del viento fuerte</li>
            </ul>
            <h4>Paso 2: Selecciona tus Plantas</h4>
            <p>Para principiantes recomendamos: lechugas, rabanitos, hierbas aromáticas.</p>
            <div class="promocion-kits">
                <h4>🎁 Kit de Inicio Huerto Urbano</h4>
                <p><strong>¡25% OFF en tu primer kit!</strong> Incluye semillas, macetas y tierra orgánica.</p>
                <p>Código: <code>MIHUERTO25</code></p>
            </div>
        `,
        descuento: 25,
        codigoCupon: "MIHUERTO25",
        fechaVencimiento: "2025-10-20",
        destacado: false
    },
    {
        id: 4,
        titulo: "¡FLASH SALE! 50% OFF en Catálogo de Productos Orgánicos",
        categoria: "Promociones",
        fecha: "2025-10-09",
        autor: "Equipo HuertoHogar",
        imagen: sale,
        resumen: "¡Solo por 48 horas! Disfruta de un 50% de descuento en nuestro catálogo de productos orgánicos.",
        contenido: `
            <div class="flash-sale">
                <h3>⚡ FLASH SALE - ¡Solo 48 Horas! ⚡</h3>
                <p class="urgencia">¡Hurry! Esta oferta termina pronto</p>
                <h4>🌿 50% OFF en Productos Orgánicos</h4>
                <ul>
                    <li><strong>Miel Orgánica:</strong> $5.000 → $2.500</li>
                    <li><strong>Quinoa Orgánica:</strong> $4.500 → $2.250</li>
                </ul>
                <div class="countdown">
                    <h4>⏰ ¡Tiempo Limitado!</h4>
                    <p>Esta oferta vence el <strong>31 de Octubre a las 23:59</strong></p>
                </div>
                <div class="cupon-flash">
                    <h4>🏃‍♀️ Código Express: FLASH50</h4>
                    <p>Aplica automáticamente en el carrito</p>
                </div>
            </div>
        `,
        descuento: 50,
        codigoCupon: "FLASH50",
        fechaVencimiento: "2025-10-31",
        destacado: true,
        urgente: true
    },
    {
        id: 5,
        titulo: "Beneficios de los Alimentos Orgánicos",
        categoria: "Salud",
        fecha: "2025-10-03",
        autor: "Dra. Ana Silva",
        imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop",
        resumen: "Conoce por qué elegir alimentos orgánicos es una inversión en tu salud y en el medio ambiente.",
        contenido: `
            <h3>🌿 ¿Por Qué Elegir Orgánico?</h3>
            <p>Los alimentos orgánicos ofrecen múltiples beneficios para tu salud:</p>
            <h4>Beneficios para la Salud:</h4>
            <ul>
                <li>Libre de pesticidas químicos</li>
                <li>Mayor contenido nutricional</li>
                <li>Mejor sabor y frescura</li>
                <li>Sin organismos genéticamente modificados</li>
            </ul>
            <h4>Beneficios Ambientales:</h4>
            <ul>
                <li>Agricultura sostenible</li>
                <li>Protección de la biodiversidad</li>
                <li>Reducción de contaminación</li>
            </ul>
            <div class="promo-organicos">
                <h4>🌱 Prueba Orgánico por Menos</h4>
                <p><strong>15% OFF en tu primera compra orgánica</strong></p>
                <p>Código: <code>ORGANICO15</code></p>
            </div>
        `,
        descuento: 15,
        codigoCupon: "ORGANICO15",
        fechaVencimiento: "2025-10-25",
        destacado: false
    },
    {
        id: 6,
        titulo: "¡REMATE! 70% OFF en Productos de Temporada",
        categoria: "Promociones",
        fecha: "2025-10-29",
        autor: "Equipo HuertoHogar",
        imagen: remate,
        resumen: "¡Última oportunidad! Descuentos de hasta 70% en productos de temporada. ¡No te lo pierdas!",
        contenido: `
            <div class="promocion-destacada">
                <h3>¡REMATE! 70% OFF en Productos de Temporada</h3>
                <p>Última oportunidad para aprovechar estos increíbles descuentos:</p>
                <ul>
                    <li><strong>Espinacas frescas:</strong> Antes $700/kg - Ahora $210/kg</li>
                    <li><strong>Leche Natural:</strong> Antes $3.800 - Ahora $1.140</li>
                    <li><strong>Miel Orgánica:</strong> Antes $5.000 - Ahora $1.500</li>
                    <li><strong>Naranjas Valencia:</strong> Antes $1.000/kg - Ahora $300/kg</li>
                </ul>
                <div class="cupon-descuento">
                    <h4>🎟️ Cupón: REMATE30</h4>
                    <p>Usa el código <strong>REMATE30</strong> al hacer tu pedido</p>
                    <small>*Válido hasta el 03 de Noviembre de 2025</small>
                </div>
            </div>
        `,
        descuento: 70,
        codigoCupon: "REMATE30",
        fechaVencimiento: "2025-11-03",
        destacado: true,
        urgente: true
    },
    {
        id: 7,
        titulo: "Expo Chile Agrícola 2025: El Futuro de la Agricultura con IA",
        categoria: "Noticias",
        fecha: "2025-10-11",
        autor: "www.expochileagricola.cl",
        imagen: "https://www.diariofruticola.cl/files/68ddd061aa810_1200x719.jpg",
        resumen: "Falta solo un mes para el evento agrícola más grande de Chile. 100% gratuito, online y enfocado en inteligencia artificial para el agro.",
        contenido: `
            <div class="noticia-agricultura">
                <h3>🌾 Expo Chile Agrícola 2025: Revolución Tecnológica en el Campo</h3>
                <p><strong>5 y 6 de Noviembre | 100% Gratuito | Modalidad Online</strong></p>
                
                <h4>🤖 El Futuro del Agro es Digital</h4>
                <p>La nueva edición de Expo Chile Agrícola pondrá el foco en la <strong>inteligencia artificial aplicada al sector silvoagropecuario</strong>, con más de 80 actividades de capacitación gratuitas.</p>
                
                <h4>🎯 Destacados del Programa:</h4>
                <ul>
                    <li><strong>Agricultura del Futuro:</strong> IA y ciencia de datos en el campo chileno (INIA)</li>
                    <li><strong>Agricultura de Precisión:</strong> La revolución del agro con IA (Instacrops)</li>
                    <li><strong>Robótica Agrícola:</strong> Innovación para el futuro (PUC)</li>
                    <li><strong>Experiencias Internacionales:</strong> Agricultura inteligente en Japón</li>
                </ul>
                
                <h4>📈 Productividad y Crecimiento:</h4>
                <ul>
                    <li>Producción sostenible en agricultura familiar</li>
                    <li>Seguros agrícolas con subsidio estatal</li>
                    <li>Fondos concursables para el agro</li>
                    <li>Panel "Mujeres agro-innovadoras"</li>
                </ul>
                
                <div class="info-evento">
                    <h4>📅 Información del Evento</h4>
                    <p><strong>Fechas:</strong> 5 y 6 de Noviembre 2025</p>
                    <p><strong>Modalidad:</strong> 100% Online</p>
                    <p><strong>Inscripciones:</strong> www.expochileagricola.cl</p>
                    <p><strong>Costo:</strong> Completamente GRATUITO</p>
                </div>
                
                <blockquote>
                    <p><em>"Un espacio donde la capacitación e información llegue a las agricultoras y agricultores, generando oportunidades para el futuro del agro."</em></p>
                    <cite>- Ministra de Agricultura, Ignacia Fernández</cite>
                </blockquote>
                
                <div class="llamada-accion">
                    <h4>🌱 ¿Te Interesa la Agricultura Moderna?</h4>
                    <p>En HuertoHogar también apostamos por la innovación y tecnología para ofrecerte los mejores productos orgánicos.</p>
                    <p><strong>¡Descubre nuestra selección de productos tecnológicos para huertos urbanos!</strong></p>
                </div>
            </div>
        `,
        destacado: true
    },
    {
        id: 8,
        titulo: "SAG Llama a Apicultores: Declaración Obligatoria de Apiarios y Colmenas",
        categoria: "Noticias",
        fecha: "2025-10-11",
        autor: "Servicio Agrícola y Ganadero (SAG)",
        imagen: "https://www.diariofruticola.cl/files/6718331cb9ee4_1200x719.jpg",
        resumen: "Declaración obligatoria durante octubre en SIPEC Apícola. Fundamental para programas sanitarios y nuevo sistema de aviso de plaguicidas.",
        contenido: `
            <div class="noticia-sag">
                <h3>🐝 SAG: Declaración Obligatoria de Apiarios Durante Octubre</h3>
                <p><strong>Plazo: Todo el mes de octubre 2025</strong></p>
                
                <h4>📋 ¿Qué Deben Declarar los Apicultores?</h4>
                <p>El Servicio Agrícola y Ganadero (SAG) hace un <strong>llamado obligatorio</strong> a todos los apicultores del país para declarar sus apiarios y colmenas en el <strong>Sistema de Información Pecuaria Apícola (SIPEC Apícola)</strong>.</p>
                
                <h4>🎯 Beneficios de la Declaración:</h4>
                <ul>
                    <li><strong>Acceso a programas oficiales</strong> de control sanitario</li>
                    <li><strong>Postulación a subsidios</strong> y apoyos estatales</li>
                    <li><strong>Recepción de avisos</strong> sobre aplicación de plaguicidas tóxicos</li>
                    <li><strong>Protección de colmenas</strong> contra pesticidas</li>
                </ul>
                
                <h4>💻 ¿Cómo Declarar?</h4>
                <div class="opciones-declaracion">
                    <p><strong>Opción 1 - En Línea:</strong></p>
                    <p>🌐 <strong>sipecweb.sag.gob.cl</strong></p>
                    
                    <p><strong>Opción 2 - Presencial:</strong></p>
                    <p>📍 Oficinas regionales del SAG<br/>
                    📝 Formulario FRADA (Registro de Apicultores y Declaración de Apiarios)</p>
                </div>
                
                <h4>⚠️ Sistema de Avisaje de Plaguicidas - ¡NUEVO!</h4>
                <div class="sistema-avisaje">
                    <p><strong>Inicio Gradual:</strong></p>
                    <ul>
                        <li><strong>Enero 2026:</strong> Plaguicidas muy tóxicos para abejas</li>
                        <li><strong>Abril 2026:</strong> Plaguicidas moderadamente tóxicos</li>
                    </ul>
                    
                    <p><strong>🚨 Aviso Obligatorio:</strong> Los agricultores deberán informar con <strong>48 horas de anticipación</strong> la aplicación de plaguicidas tóxicos a apicultores registrados cercanos.</p>
                </div>
                
                <h4>📞 Información y Contacto SAG:</h4>
                <div class="contacto-sag">
                    <p>🌐 <strong>Web:</strong> www.sag.cl</p>
                    <p>📞 <strong>Teléfono:</strong> 22 345 1100</p>
                    <p>📧 <strong>Email:</strong> oficina.informaciones@sag.gob.cl</p>
                </div>
                
                <div class="importante">
                    <h4>⚠️ IMPORTANTE</h4>
                    <p><strong>Mantén actualizados tus datos de contacto</strong> (teléfono y email) para recibir notificaciones oportunas que protejan tus abejas.</p>
                </div>
                
                <div class="conexion-huertohogar">
                    <h4>🍯 En HuertoHogar Apoyamos la Apicultura</h4>
                    <p>Valoramos el trabajo de nuestros apicultores locales. <strong>¡Descubre nuestra miel orgánica certificada!</strong></p>
                </div>
            </div>
        `,
        destacado: true
    },
    {
        id: 9,
        titulo: "Talleres Gratuitos de Huertos Urbanos para Comunidades",
        categoria: "Noticias",
        fecha: "2025-10-11",
        autor: "Equipo HuertoHogar",
        imagen: image,
        resumen: "HuertoHogar lanza programa de talleres gratuitos para enseñar agricultura urbana a comunidades vulnerables y juntas de vecinos.",
        contenido: `
            <div class="noticia-comunitaria">
                <h3>🌱 Talleres Gratuitos: Construyendo Comunidades más Verdes</h3>
                <p><strong>¡HuertoHogar se compromete con el desarrollo comunitario!</strong></p>
                
                <h4>🎯 ¿De Qué Se Trata la Iniciativa?</h4>
                <p>Hemos lanzado un <strong>programa de talleres 100% gratuitos</strong> de huertos urbanos dirigido a:</p>
                <ul>
                    <li><strong>Juntas de vecinos</strong> de sectores vulnerables</li>
                    <li><strong>Centros comunitarios</strong> y organizaciones sociales</li>
                    <li><strong>Colegios municipales</strong> y jardines infantiles</li>
                    <li><strong>Organizaciones de adultos mayores</strong></li>
                    <li><strong>Centros de rehabilitación</strong> y terapéuticos</li>
                </ul>
                
                <h4>📚 ¿Qué Aprenderás en los Talleres?</h4>
                <div class="contenido-talleres">
                    <p><strong>Módulo 1: Fundamentos (2 horas)</strong></p>
                    <ul>
                        <li>🏠 Espacios apropiados para huertos urbanos</li>
                        <li>🌱 Selección de plantas según clima y espacio</li>
                        <li>💧 Sistemas de riego eficientes</li>
                        <li>🌱 Preparación de suelos y compost casero</li>
                    </ul>
                    
                    <p><strong>Módulo 2: Práctica (3 horas)</strong></p>
                    <ul>
                        <li>🥕 Siembra de verduras de temporada</li>
                        <li>🌿 Cultivo de hierbas aromáticas</li>
                        <li>🔧 Construcción de jardineras con material reciclado</li>
                        <li>🐛 Control natural de plagas</li>
                    </ul>
                    
                    <p><strong>Módulo 3: Seguimiento (1 mes)</strong></p>
                    <ul>
                        <li>📱 Grupo de WhatsApp para consultas</li>
                        <li>🎥 Videos de seguimiento</li>
                        <li>🆘 Visitas de emergencia en caso necesario</li>
                    </ul>
                </div>
                
                <h4>🎁 ¿Qué Incluye Cada Taller?</h4>
                <div class="incluye-taller">
                    <p><strong>📦 Kit Gratuito para Cada Participante:</strong></p>
                    <ul>
                        <li>🌱 Semillas orgánicas (lechugas, rabanitos, cilantro)</li>
                        <li>🪴 2 macetas biodegradables</li>
                        <li>🌱 Sustrato orgánico (2kg)</li>
                        <li>📖 Manual ilustrado de huertos urbanos</li>
                        <li>🎯 Calendario de siembra y cosecha</li>
                    </ul>
                    
                    <p><strong>☕ Además:</strong></p>
                    <ul>
                        <li>☕ Coffee break saludable con productos orgánicos</li>
                        <li>📸 Certificado de participación</li>
                        <li>🎁 Cupón 20% OFF en productos HuertoHogar</li>
                    </ul>
                </div>
                
                <h4>📅 Cronograma de Talleres - Noviembre 2025</h4>
                <div class="cronograma">
                    <p><strong>Sábado 9 de Noviembre:</strong> Comuna de Maipú<br/>
                    <small>📍 Centro Comunitario Villa San Luis - 10:00 AM</small></p>
                    
                    <p><strong>Sábado 16 de Noviembre:</strong> Comuna de Puente Alto<br/>
                    <small>📍 Junta de Vecinos Villa Cordillera - 10:00 AM</small></p>
                    
                    <p><strong>Sábado 23 de Noviembre:</strong> Comuna de La Pintana<br/>
                    <small>📍 Centro de Adultos Mayores "Sol Naciente" - 10:00 AM</small></p>
                    
                    <p><strong>Sábado 30 de Noviembre:</strong> Comuna de Quilicura<br/>
                    <small>📍 Escuela Municipal Pablo Neruda - 10:00 AM</small></p>
                </div>
                
                <h4>📝 ¿Cómo Inscribirse?</h4>
                <div class="inscripcion">
                    <p><strong>Para Organizaciones:</strong></p>
                    <p>📧 <strong>Email:</strong> talleres@huertohogar.cl</p>
                    <p>📞 <strong>WhatsApp:</strong> +56 9 8765 4321</p>
                    <p>🌐 <strong>Formulario:</strong> www.huertohogar.cl/talleres-comunitarios</p>
                    
                    <p><strong>Requisitos mínimos:</strong></p>
                    <ul>
                        <li>👥 Mínimo 15 personas inscritas</li>
                        <li>🏢 Espacio adecuado para el taller</li>
                        <li>📋 Lista de participantes confirmados</li>
                    </ul>
                </div>
                
                <h4>💚 Nuestro Compromiso Social</h4>
                <div class="compromiso">
                    <p><em>"Creemos que todos tienen derecho a alimentarse sanamente y a conectarse con la naturaleza, sin importar su situación económica."</em></p>
                    <cite>- María González, Directora de Responsabilidad Social HuertoHogar</cite>
                    
                    <p><strong>🎯 Meta 2025:</strong> Capacitar a <strong>500 familias</strong> en técnicas de agricultura urbana</p>
                    <p><strong>🌱 Impacto esperado:</strong> <strong>50 huertos comunitarios</strong> funcionando</p>
                </div>
                
                <div class="llamada-accion-comunidad">
                    <h4>🤝 ¡Únete al Movimiento Verde!</h4>
                    <p>¿Tu organización quiere ser parte? ¡Contáctanos y coordinemos un taller en tu comunidad!</p>
                    <p><strong>¡Juntos cultivamos un futuro más sostenible! 🌱</strong></p>
                </div>
            </div>
        `,
        destacado: true
    }
];

export const categoriasBlogs = [
    { nombre: "Todas", valor: "todas" },
    { nombre: "Promociones", valor: "Promociones" },
    { nombre: "Consejos", valor: "Consejos" },
    { nombre: "Tutoriales", valor: "Tutoriales" },
    { nombre: "Salud", valor: "Salud" },
    { nombre: "Noticias", valor: "Noticias" }
];

export const promocionesActivas = blogPosts.filter(post =>
    post.descuento && new Date(post.fechaVencimiento) > new Date()
);