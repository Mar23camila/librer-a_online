📚 GUÍA: MIGRACIÓN A API REAL (Fetch/Axios)
============================================

El proyecto está diseñado para facilitar la migración de la API simulada a una real.
Solo necesitas reemplazar las funciones en `src/api/apiClient.js`.

═══════════════════════════════════════════════════════════════════════════════

1️⃣ OPCIÓN A: MIGRACIÓN CON FETCH API
─────────────────────────────────────────────────────────────────────────────

📝 Paso 1: Crea un cliente fetch base

```javascript
// src/api/fetchClient.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://tu-api.com";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem("pv_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.message || response.statusText, response.status);
  }

  return response.json();
}

export const get = (endpoint) => fetchAPI(endpoint);
export const post = (endpoint, data) => fetchAPI(endpoint, {
  method: "POST",
  body: JSON.stringify(data),
});
export const put = (endpoint, data) => fetchAPI(endpoint, {
  method: "PUT",
  body: JSON.stringify(data),
});
export const del = (endpoint) => fetchAPI(endpoint, { method: "DELETE" });
```

📝 Paso 2: Reemplaza las funciones en apiClient.js

```javascript
// src/api/apiClient.js
import * as api from "./fetchClient";

// Antes (simulado):
export async function login({ email, password }) {
  await delay();
  const db = loadDB();
  const user = db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user || user.password !== password) {
    throw new ApiError("Email o contraseña incorrectos", 401);
  }
  const token = makeToken(user);
  return { token, user: sanitizeUser(user) };
}

// Después (con Fetch):
export async function login({ email, password }) {
  const data = await api.post("/auth/login", { email, password });
  return data; // { token, user }
}

// Antes (simulado):
export async function getProducts() {
  await delay();
  const db = loadDB();
  return db.products;
}

// Después (con Fetch):
export async function getProducts() {
  return api.get("/products");
}

// Antes (simulado):
export async function createProduct(data, token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  const product = { id: uid("b"), ...data };
  db.products.push(product);
  saveDB(db);
  return product;
}

// Después (con Fetch):
export async function createProduct(data, token) {
  return api.post("/products", data);
  // El token ya se envía en headers automáticamente
}
```

═══════════════════════════════════════════════════════════════════════════════

2️⃣ OPCIÓN B: MIGRACIÓN CON AXIOS
─────────────────────────────────────────────────────────────────────────────

📝 Paso 1: Instala Axios

```bash
npm install axios
```

📝 Paso 2: Crea una instancia configurada

```javascript
// src/api/axiosClient.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://tu-api.com";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("pv_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    const status = error.response?.status;
    throw new ApiError(message, status);
  }
);

export default client;
```

📝 Paso 3: Usa axios en apiClient.js

```javascript
// src/api/apiClient.js
import client from "./axiosClient";

export async function login({ email, password }) {
  return client.post("/auth/login", { email, password });
}

export async function getProducts() {
  return client.get("/products");
}

export async function createProduct(data) {
  return client.post("/products", data);
}

export async function updateProduct(id, data) {
  return client.put(`/products/${id}`, data);
}

export async function deleteProduct(id) {
  return client.delete(`/products/${id}`);
}
```

═══════════════════════════════════════════════════════════════════════════════

3️⃣ CONFIGURACIÓN DE VARIABLES DE ENTORNO
─────────────────────────────────────────────────────────────────────────────

📝 .env.local (local):

```
VITE_API_URL=http://localhost:3000
```

📝 .env.production (producción):

```
VITE_API_URL=https://api.paginasvioleta.com
```

📝 Uso en el código:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api-default.com";
```

═══════════════════════════════════════════════════════════════════════════════

4️⃣ ENDPOINTS ESPERADOS DEL BACKEND
─────────────────────────────────────────────────────────────────────────────

Tu API backend debe implementar estos endpoints:

📋 AUTENTICACIÓN
  POST   /auth/login                    → login({ email, password })
  POST   /auth/register                 → registerClient({ nombre, email, password, telefono, direccion })
  POST   /auth/register-admin           → registerAdmin({ nombre, email, password, telefono }, token)

📋 PRODUCTOS
  GET    /products                      → getProducts()
  GET    /products/:id                  → getProduct(id)
  POST   /products                      → createProduct(data, token)
  PUT    /products/:id                  → updateProduct(id, data, token)
  DELETE /products/:id                  → deleteProduct(id, token)

📋 ÓRDENES
  POST   /orders                        → createOrder(items, token)
  GET    /orders                        → getUserOrders(token)
  GET    /orders/:id                    → getOrder(id, token)
  GET    /admin/orders                  → getAllOrders(token)
  PUT    /admin/orders/:id              → updateOrderStatus(id, estado, token)

📋 USUARIOS (ADMIN)
  GET    /admin/users                   → getAllUsers(token)
  GET    /admin/users/:id               → getUser(id, token)
  PUT    /admin/users/:id               → updateUser(id, updates, token)
  DELETE /admin/users/:id               → deleteUser(id, token)

═══════════════════════════════════════════════════════════════════════════════

5️⃣ EJEMPLO COMPLETO: SERVIDOR EXPRESS + MONGODB
─────────────────────────────────────────────────────────────────────────────

📝 backend/server.js

```javascript
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "tu-super-secreto";

// Middleware: autenticar token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No autenticado" });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
};

// LOGIN
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  // Busca en base de datos
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }
  
  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  
  res.json({ token, user: { id: user.id, nombre: user.nombre, role: user.role } });
});

// GET PRODUCTOS (público)
app.get("/products", (req, res) => {
  res.json(products);
});

// CREATE PRODUCTO (admin)
app.post("/products", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  res.json(newProduct);
});

// GET ÓRDENES (usuario autenticado)
app.get("/orders", authMiddleware, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
});

// CREATE ORDEN
app.post("/orders", authMiddleware, (req, res) => {
  const { items } = req.body;
  const newOrder = {
    id: Date.now(),
    userId: req.user.id,
    items,
    total: items.reduce((sum, it) => sum + it.precio * it.cantidad, 0),
    estado: "Pendiente",
    fecha: new Date().toISOString(),
  };
  orders.push(newOrder);
  res.json(newOrder);
});

app.listen(3000, () => console.log("Backend running on :3000"));
```

═══════════════════════════════════════════════════════════════════════════════

6️⃣ TESTING DURANTE LA MIGRACIÓN
─────────────────────────────────────────────────────────────────────────────

📝 Usa una herramienta para testear endpoints:

```bash
# Con curl
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456"}'

# Con Postman
POST http://localhost:3000/auth/login
Headers: Content-Type: application/json
Body: { "email": "user@test.com", "password": "123456" }
```

═══════════════════════════════════════════════════════════════════════════════

7️⃣ CHECKLIST DE MIGRACIÓN
─────────────────────────────────────────────────────────────────────────────

✅ Crear cliente HTTP (fetch o axios)
✅ Reemplazar cada función en apiClient.js
✅ Configurar variables de entorno
✅ Testear endpoints con Postman/curl
✅ Verificar que el login persiste token
✅ Verificar que el carrito se carga/guarda
✅ Verificar que el logout borra token
✅ Testear formularios (validación debe continuar)
✅ Testear manejo de errores (try/catch)
✅ Verificar que los toasts funcionan
✅ Testing en navegadores antiguos

═══════════════════════════════════════════════════════════════════════════════

✨ VENTAJA: EL FRONTEND NO CAMBIA

Gracias a esta arquitectura limpia, puedes migrar de API simulada a real
sin tocar NADA en componentes, contextos, hooks o estilos. Todo sigue funcionando igual.

═══════════════════════════════════════════════════════════════════════════════
