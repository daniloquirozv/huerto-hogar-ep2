# 🔧 Solución: Mapeo de Campos API → Frontend

## 📋 Problema Identificado

Tu modelo de Spring Boot usa nombres diferentes a los que espera React:

### Mapeo de Campos:

| Spring Boot (API)        | React (Frontend) | Transformación |
|--------------------------|------------------|----------------|
| `idProducto`             | `id` / `codigo`  | ✅ Automático  |
| `nombreProducto`         | `nombre`         | ✅ Automático  |
| `precioProducto`         | `precio`         | ✅ Automático  |
| `unidadProducto`         | `unidad`         | ✅ Automático  |
| `stockProducto`          | `stock`          | ✅ Automático  |
| `descripcionProducto`    | `descripcion`    | ✅ Automático  |
| `idCategoria.nombreCategoria` | `categoria` | ✅ Automático |

## 📦 Formato Esperado de la API

### Tu API debe retornar (Spring Boot):
```json
[
  {
    "idProducto": 1,
    "nombreProducto": "Manzanas Fuji",
    "precioProducto": 1200,
    "unidadProducto": "kg",
    "stockProducto": 150,
    "descripcionProducto": "Manzanas frescas y crujientes",
    "idCategoria": {
      "idCategoria": 1,
      "nombreCategoria": "Frutas Frescas"
    }
  },
  {
    "idProducto": 2,
    "nombreProducto": "Lechuga Orgánica",
    "precioProducto": 800,
    "unidadProducto": "unidad",
    "stockProducto": 50,
    "descripcionProducto": "Lechuga fresca orgánica",
    "idCategoria": {
      "idCategoria": 2,
      "nombreCategoria": "Verduras"
    }
  }
]
```

### Se transforma automáticamente a (React):
```json
[
  {
    "id": 1,
    "codigo": "PROD001",
    "nombre": "Manzanas Fuji",
    "precio": 1200,
    "unidad": "kg",
    "stock": 150,
    "descripcion": "Manzanas frescas y crujientes",
    "categoria": "Frutas Frescas",
    "categoriaId": 1,
    "imagen": "/images/productos/default.png"
  },
  {
    "id": 2,
    "codigo": "PROD002",
    "nombre": "Lechuga Orgánica",
    "precio": 800,
    "unidad": "unidad",
    "stock": 50,
    "descripcion": "Lechuga fresca orgánica",
    "categoria": "Verduras",
    "categoriaId": 2,
    "imagen": "/images/productos/default.png"
  }
]
```

## ✅ Archivos Creados/Modificados

1. **`src/services/transformadorProductos.js`** ← NUEVO
   - Transforma automáticamente los datos de la API
   
2. **`src/services/productosService.js`** ← MODIFICADO
   - Usa el transformador en todas las funciones
   - Logs mejorados para debugging

3. **`src/pages/productosPage.jsx`** ← MODIFICADO
   - Mejor manejo de errores
   - Logs detallados en consola

## 🧪 Cómo Verificar

### 1. Verifica tu API directamente

Abre en el navegador o usa curl:
\`\`\`bash
curl http://localhost:8080/api/v1/huertohogar/productos
\`\`\`

Deberías ver un JSON con tus productos.

### 2. Verifica los logs en la consola

Abre la página de productos y mira la consola del navegador (F12):

Deberías ver:
\`\`\`
🚀 Iniciando carga de productos desde API...
🔍 Llamando a la API de productos...
📦 Datos crudos de la API: [...]
✅ Productos transformados: [...]
📊 Total de productos: 5
✅ Productos recibidos: [...]
📦 5 productos cargados exitosamente
\`\`\`

### 3. Si hay error, verás:

\`\`\`
❌ Error al cargar productos: [mensaje del error]
Detalles del error: {...}
\`\`\`

## 🔍 Diagnóstico de Problemas

### Problema 1: Página en blanco sin errores

**Causa:** Los productos se cargan pero no se muestran.

**Solución:** Verifica en la consola:
\`\`\`javascript
console.log('Productos en estado:', productos);
\`\`\`

### Problema 2: Error 404

**Causa:** La ruta no existe en tu API.

**Solución:** Verifica que tu Controller tenga:
\`\`\`java
@GetMapping("/productos")
public List<Producto> obtenerProductos() {
    return productoService.findAll();
}
\`\`\`

### Problema 3: Error CORS

**Causa:** Spring Boot rechaza peticiones del frontend.

**Solución:** Añade en tu Controller:
\`\`\`java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/huertohogar")
public class ProductoController {
    // ...
}
\`\`\`

### Problema 4: Datos null o undefined

**Causa:** Los nombres de campos no coinciden.

**Solución:** Ya está resuelto con el transformador, pero verifica que tu modelo tenga getters/setters.

## 🎯 Spring Boot - Asegúrate de tener esto

### 1. Model con Jackson (JSON)
\`\`\`java
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)    
    private Integer idProducto;
    
    private String nombreProducto;
    private int precioProducto;
    private String unidadProducto;
    private String descripcionProducto;
    private int stockProducto;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Categoria idCategoria;
    
    // Getters y Setters (IMPORTANTE)
    public Integer getIdProducto() { return idProducto; }
    public void setIdProducto(Integer idProducto) { this.idProducto = idProducto; }
    
    public String getNombreProducto() { return nombreProducto; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }
    
    // ... resto de getters/setters
}
\`\`\`

### 2. Controller
\`\`\`java
@RestController
@RequestMapping("/api/v1/huertohogar")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @GetMapping("/productos")
    public ResponseEntity<List<Producto>> obtenerProductos() {
        List<Producto> productos = productoService.findAll();
        return ResponseEntity.ok(productos);
    }
}
\`\`\`

### 3. Categoria Model (si usas relación)
\`\`\`java
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategoria;
    
    private String nombreCategoria;
    
    // Getters y Setters
    public Integer getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Integer idCategoria) { this.idCategoria = idCategoria; }
    
    public String getNombreCategoria() { return nombreCategoria; }
    public void setNombreCategoria(String nombreCategoria) { this.nombreCategoria = nombreCategoria; }
}
\`\`\`

## 🚀 Pasos Finales

1. **Asegúrate que Spring Boot esté corriendo:**
   \`\`\`bash
   # En tu proyecto Spring Boot
   ./mvnw spring-boot:run
   \`\`\`

2. **Verifica el endpoint manualmente:**
   \`\`\`
   http://localhost:8080/api/v1/huertohogar/productos
   \`\`\`

3. **Reinicia el servidor de Vite:**
   \`\`\`bash
   # Ctrl+C para detener
   npm run dev
   \`\`\`

4. **Abre la página de productos:**
   \`\`\`
   http://localhost:3000/productos
   \`\`\`

5. **Revisa la consola del navegador (F12)**
   Busca los logs con emojis: 🚀 🔍 📦 ✅ ❌

## 📊 Checklist

- [ ] Spring Boot corriendo en puerto 8080
- [ ] Endpoint retorna JSON válido
- [ ] Campos tienen getters/setters
- [ ] CORS habilitado
- [ ] Vite server reiniciado
- [ ] No hay errores en consola del navegador
- [ ] Productos se muestran en la página

## 💡 Tip: Ver los datos en tiempo real

Añade esto temporalmente en tu componente:
\`\`\`jsx
useEffect(() => {
  console.log('Estado de productos:', productos);
}, [productos]);
\`\`\`
