# 📖 Páginas Violeta — Librería Online

Taller práctico de React: tienda online de libros con autenticación, carrito de
compras, pedidos con seguimiento y panel de administración. Tema visual morado
y negro, inspirado en una librería/biblioteca.

## Descripción del proyecto

La aplicación simula una librería online con dos roles:

- **Cliente**: se registra, inicia sesión, navega el catálogo de libros, arma
  su carrito, realiza pedidos y consulta su historial y el detalle de cada uno.
- **Administrador**: inicia sesión, ve el listado de clientes registrados,
  crea nuevos administradores, ve todos los pedidos y los aprueba/rechaza, y
  además puede gestionar el catálogo completo (crear, editar y eliminar libros).

No necesitas levantar un backend aparte: el proyecto incluye una **API REST
simulada** (`src/api/apiClient.js`) que se comporta como una API real (con
tokens, roles, errores HTTP y latencia de red simulada) pero persiste los
datos en `localStorage` del navegador. Así puedes clonar, instalar y correr
el proyecto sin configuración adicional. Si más adelante quieres conectarlo a
un backend real (Node/Express, JSON Server, Firebase, etc.), solo tienes que
reemplazar el contenido de las funciones de `apiClient.js` por llamadas
`fetch`/`axios` reales; el resto de la app (componentes, contexts, rutas) no
cambia.

## Instrucciones de instalación y ejecución

Requisitos: Node.js 18 o superior.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
http://localhost:5173
```

Otros comandos útiles:

```bash
npm run build         # genera la versión de producción en /dist
npm run preview       # sirve la build de producción localmente
npm test              # ejecuta las pruebas unitarias (44 tests)
npm run test:watch    # pruebas en modo watch
npm run test:coverage # cobertura de código
```

## Credenciales de prueba

| Rol           | Email                          | Contraseña  |
|---------------|--------------------------------|-------------|
| Cliente       | cliente@paginasvioleta.com     | cliente123  |
| Administrador | admin@paginasvioleta.com       | admin123    |

También puedes registrar una cuenta de cliente nueva desde `/registro`, o
crear administradores adicionales desde el panel de administración
(`Panel administrador → Crear admin`), una vez que hayas iniciado sesión como admin.

> Los datos (usuarios, libros y pedidos) se guardan en el `localStorage` de tu
> navegador bajo la clave `pv_db_v1`. Si quieres reiniciar los datos a los
> valores de fábrica, borra esa clave desde las herramientas de desarrollador
> (Application → Local Storage) o ejecuta en la consola:
> `localStorage.removeItem('pv_db_v1')` y recarga la página.

## Enlace a la API utilizada

Esta app usa una API REST simulada local (no requiere URL pública). Las
portadas de los libros se obtienen de la API pública y gratuita de
[Open Library Covers](https://openlibrary.org/dev/docs/api/covers), o
puedes subir tus propias imágenes desde el panel de administración.

## Funcionalidades implementadas

### Autenticación y registro
- Registro de clientes (nombre, email, contraseña, teléfono, dirección).
- Inicio de sesión para clientes y administradores.
- Token y rol guardados en `localStorage`, persistiendo la sesión al recargar.
- Redirección automática según rol (cliente → tienda, admin → panel).
- Rutas protegidas (`ProtectedRoute`) que exigen sesión iniciada y, según el
  caso, un rol específico.

### Módulo cliente
- Catálogo de libros con imagen, título, autor, precio y descripción corta.
- Buscador por título/autor y filtro por categoría.
- **Paginación** en el listado de productos (8 por página).
- Agregar al carrito, ajustar cantidades o eliminar productos.
- Contador de productos en el carrito visible en el navbar.
- Confirmar pedido (se registra en la API simulada y se vacía el carrito).
- Historial de pedidos con fecha, total y estado (**paginado**).
- Detalle de cada pedido con los libros que lo componen.
- Estados del pedido: Pendiente, Aprobado, Rechazado, Enviado, Entregado.

### Módulo administrador
- Dashboard con resumen de clientes, pedidos, pendientes e ingresos.
- Listado de clientes registrados con información completa.
- Formulario para crear nuevos administradores.
- Listado de todos los pedidos con filtro por estado (**paginado**).
- Aprobar, rechazar, marcar como enviado o entregado cada pedido.
- Detalle de pedido con información del cliente y productos.

### Gestión de productos (CRUD completo)
- Crear, editar y eliminar libros (solo administradores).
- **Subir imágenes** desde el dispositivo (archivo → base64) o pegar URL externa.
- Validación de tipo y tamaño de imagen (máx 2 MB).
- Vista previa de la imagen antes de guardar.

### Técnico
- React + Vite con React Router DOM (rutas protegidas y anidadas).
- **Context API** para estado global:
  - `AuthContext` - autenticación y roles
  - `CartContext` - carrito de compras (persistente por usuario)
  - `OrderContext` - pedidos y gestión de estados
  - `ToastContext` - notificaciones toast
  - `ErrorContext` - manejo centralizado de errores
  - `UserContext` - gestión de usuarios admin
- **Hooks**: `useState`, `useEffect`, `useContext`, `useMemo`, `useCallback`,
  `useNavigate`, `useParams`, y hooks personalizados (`useAuth`, `useCart`,
  `useOrders`, `useUsers`, `useGlobalError`, `usePagination`).
- Formularios controlados con validación.
- Interfaz responsive (móvil, tablet, escritorio) con Tailwind CSS.
- Indicadores de carga (spinners) y mensajes de éxito/error (toasts).
- **Dark mode** como tema predeterminado (paleta violeta y negro).
- **Pruebas unitarias**: 44 tests con Jest + React Testing Library.
- **Despliegue**: configurado para Vercel y Netlify.

## Estructura de carpetas

```
src/
├── api/                apiClient.js (API REST simulada) + seedData.js
├── components/
│   ├── common/         Navbar, Footer, ProtectedRoute, Spinner, StatusBadge,
│   │                   FormField, Pagination, ImageUpload
│   ├── auth/           Login, Register
│   ├── client/         ProductList, ProductCard, Cart, CartItem,
│   │                   OrderHistory, OrderDetail
│   └── admin/          AdminDashboard, ClientList, CreateAdmin, OrderList,
│                       OrderDetailAdmin, ProductManage, AdminUsersPanel
├── context/            AuthContext, CartContext, OrderContext, ToastContext,
│                       ErrorContext, UserContext, AppProvider
├── hooks/              useAuth, useCart, useOrders, useUsers, useGlobalError,
│                       usePagination
├── pages/              HomePage, ShopPage, CartPage, OrdersPage,
│                       OrderDetailPage, AdminPage, NotFoundPage
├── utils/              helpers.js, persistenceMiddleware.js, devTools.js
├── __tests__/          Pruebas unitarias (helpers, apiClient, componentes)
├── App.jsx
└── main.jsx
```

## Requisitos del taller (checklist)

### Funcionales
- [x] 1.1 Formulario de registro de clientes
- [x] 1.2 Formulario de inicio de sesión
- [x] 1.3 Token y rol guardados en localStorage
- [x] 1.4 Redirección según rol
- [x] 1.5 Rutas protegidas
- [x] 2.1 Listado de productos con imagen, nombre, precio
- [x] 2.2 Botón agregar al carrito
- [x] 2.3 Carrito con cantidad, subtotal y total
- [x] 2.4 Ajustar cantidades / eliminar productos
- [x] 2.5 Realizar pedido
- [x] 2.6 Historial de pedidos
- [x] 2.7 Detalle del pedido
- [x] 2.8 Estados del pedido
- [x] 3.1 Dashboard admin
- [x] 3.2 Listado de clientes
- [x] 3.3 Crear administradores
- [x] 3.4 Listado de pedidos
- [x] 3.5 Aprobar/Rechazar pedidos
- [x] 3.6 Detalle del pedido (admin)
- [x] 4.1 CRUD de productos

### Técnicos
- [x] React con Vite
- [x] React Router DOM
- [x] Context API (estado global)
- [x] Fetch API / Axios (capa de API simulada)
- [x] Hooks (useState, useEffect, useContext, etc.)
- [x] Manejo de formularios con validación
- [x] LocalStorage (token persistente)
- [x] Buenas prácticas (componentes funcionales, carpetas organizadas)
- [x] Estilos con Tailwind CSS (responsive, paleta consistente)

### Extras (puntos adicionales)
- [x] Despliegue configurado (Vercel + Netlify)
- [x] Filtros de búsqueda de productos
- [x] Paginación en listados
- [x] CRUD completo de productos
- [x] Subir imágenes de productos
- [x] Dark Mode
- [x] Pruebas unitarias (Jest + React Testing Library, 44 tests)

## Rutas de la aplicación

| Ruta                    | Acceso       | Descripción                     |
|-------------------------|--------------|----------------------------------|
| `/`                     | Público      | Página de inicio                 |
| `/login`                | Público      | Inicio de sesión                 |
| `/registro`             | Público      | Registro de cliente              |
| `/tienda`               | Cliente      | Catálogo de libros               |
| `/carrito`              | Cliente      | Carrito de compras               |
| `/pedidos`              | Cliente      | Historial de pedidos             |
| `/pedidos/:id`          | Cliente      | Detalle del pedido               |
| `/admin`                | Admin        | Dashboard                        |
| `/admin/clientes`       | Admin        | Listado de clientes              |
| `/admin/pedidos`        | Admin        | Todos los pedidos                |
| `/admin/pedidos/:id`    | Admin        | Detalle y gestión del pedido     |
| `/admin/productos`      | Admin        | CRUD de libros                   |
| `/admin/crear-admin`    | Admin        | Crear administrador              |

## Video de demostración

*(grabar video de máximo 5 minutos mostrando todas las funcionalidades)*

## Despliegue

El proyecto está configurado para desplegarse en:

- **Vercel**: incluye `vercel.json` con configuración SPA (rewrites).
- **Netlify**: incluye `netlify.toml` con configuración SPA (redirects).

Para desplegar, conecta tu repositorio de GitHub a la plataforma deseada.

---

¡Éxito con el taller! 🚀