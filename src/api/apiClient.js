// apiClient.js
// -----------------------------------------------------------------------
// Cliente de API para "Páginas Violeta".
//
// Para que el proyecto funcione de inmediato sin necesidad de levantar un
// backend aparte, esta capa SIMULA una API REST completa (con "latencia de
// red", tokens y códigos de error) pero persiste todo en localStorage.
//
// Todas las funciones son `async` y devuelven/lanzan errores igual que si
// hicieras `fetch()` a un backend real. Esto significa que el día de mañana
// puedes reemplazar el contenido de estas funciones por llamadas `fetch`
// reales a tu propia API en Node/Express o JSON Server, sin tener que tocar
// el resto de la aplicación (componentes, contexts, etc.).
// -----------------------------------------------------------------------

import { seedBooks, seedUsers } from "./seedData";

const DB_KEY = "pv_db_v1";
const NETWORK_DELAY = 350;

function delay(ms = NETWORK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const initial = { users: seedUsers, products: seedBooks, orders: [] };
  localStorage.setItem(DB_KEY, JSON.stringify(initial));
  return initial;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeToken(user) {
  // Token simulado (NO usar este esquema en producción real).
  return btoa(`${user.id}:${user.role}:${Date.now()}`);
}

function parseToken(token) {
  try {
    const [id, role] = atob(token).split(":");
    return { id, role };
  } catch {
    return null;
  }
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function requireAuth(token) {
  const parsed = token && parseToken(token);
  if (!parsed) throw new ApiError("No autenticado", 401);
  const db = loadDB();
  const user = db.users.find((u) => u.id === parsed.id);
  if (!user) throw new ApiError("Usuario no encontrado", 401);
  return user;
}

function requireAdmin(token) {
  const user = requireAuth(token);
  if (user.role !== "admin") throw new ApiError("Acceso solo para administradores", 403);
  return user;
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

// ---------------------------------------------------------------------
// AUTENTICACIÓN — POST /api/auth/register, /login, /register-admin
// ---------------------------------------------------------------------

export async function registerClient({ nombre, email, password, telefono, direccion }) {
  await delay();
  const db = loadDB();
  if (!nombre || !email || !password) {
    throw new ApiError("Nombre, email y contraseña son obligatorios", 400);
  }
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new ApiError("Ya existe una cuenta registrada con ese email", 409);
  }
  const user = {
    id: uid("u"),
    nombre,
    email,
    password,
    telefono: telefono || "",
    direccion: direccion || "",
    role: "cliente",
    creadoEn: new Date().toISOString(),
  };
  db.users.push(user);
  saveDB(db);
  const token = makeToken(user);
  return { token, user: sanitizeUser(user) };
}

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

export async function registerAdmin({ nombre, email, password, telefono }, token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new ApiError("Ya existe una cuenta con ese email", 409);
  }
  const user = {
    id: uid("u"),
    nombre,
    email,
    password,
    telefono: telefono || "",
    direccion: "",
    role: "admin",
    creadoEn: new Date().toISOString(),
  };
  db.users.push(user);
  saveDB(db);
  return sanitizeUser(user);
}

// ---------------------------------------------------------------------
// LIBROS (PRODUCTOS) — /api/products
// ---------------------------------------------------------------------

export async function getProducts() {
  await delay();
  const db = loadDB();
  return db.products;
}

export async function getProduct(id) {
  await delay();
  const db = loadDB();
  const product = db.products.find((p) => p.id === id);
  if (!product) throw new ApiError("Libro no encontrado", 404);
  return product;
}

export async function createProduct(data, token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  const product = { id: uid("b"), ...data };
  db.products.push(product);
  saveDB(db);
  return product;
}

export async function updateProduct(id, data, token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) throw new ApiError("Libro no encontrado", 404);
  db.products[idx] = { ...db.products[idx], ...data };
  saveDB(db);
  return db.products[idx];
}

export async function deleteProduct(id, token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  db.products = db.products.filter((p) => p.id !== id);
  saveDB(db);
  return { ok: true };
}

// ---------------------------------------------------------------------
// PEDIDOS — /api/orders
// ---------------------------------------------------------------------

export async function createOrder(items, token) {
  await delay();
  const user = requireAuth(token);
  if (!items || items.length === 0) {
    throw new ApiError("El carrito está vacío", 400);
  }
  const db = loadDB();
  const total = items.reduce((sum, it) => sum + it.precio * it.cantidad, 0);
  const order = {
    id: uid("o"),
    userId: user.id,
    items,
    total,
    estado: "Pendiente",
    fecha: new Date().toISOString(),
  };
  db.orders.push(order);
  saveDB(db);
  return order;
}

export async function getUserOrders(token) {
  await delay();
  const user = requireAuth(token);
  const db = loadDB();
  return db.orders
    .filter((o) => o.userId === user.id)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export async function getAllOrders(token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  return [...db.orders].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export async function getOrder(id, token) {
  await delay();
  const user = requireAuth(token);
  const db = loadDB();
  const order = db.orders.find((o) => o.id === id);
  if (!order) throw new ApiError("Pedido no encontrado", 404);
  if (user.role !== "admin" && order.userId !== user.id) {
    throw new ApiError("No tienes permiso para ver este pedido", 403);
  }
  return order;
}

export async function updateOrderStatus(id, estado, token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new ApiError("Pedido no encontrado", 404);
  db.orders[idx] = { ...db.orders[idx], estado };
  saveDB(db);
  return db.orders[idx];
}

// ---------------------------------------------------------------------
// USUARIOS — /api/users (solo admin)
// ---------------------------------------------------------------------

export async function getUsers(token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  return db.users.map(sanitizeUser);
}

export async function getAllUsers(token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  return db.users.map(sanitizeUser);
}

export async function getUser(id, token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  const user = db.users.find((u) => u.id === id);
  if (!user) throw new ApiError("Usuario no encontrado", 404);
  return sanitizeUser(user);
}

export async function updateUser(id, updates, token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) throw new ApiError("Usuario no encontrado", 404);
  
  const { password, ...safeUpdates } = updates; // No permitir cambiar contraseña desde aquí
  db.users[idx] = { ...db.users[idx], ...safeUpdates };
  saveDB(db);
  return sanitizeUser(db.users[idx]);
}

export async function deleteUser(id, token) {
  await delay();
  requireAdmin(token);
  const db = loadDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) throw new ApiError("Usuario no encontrado", 404);
  db.users.splice(idx, 1);
  saveDB(db);
  return { ok: true };
}

export function getUserFromToken(token) {
  const parsed = token && parseToken(token);
  if (!parsed) return null;
  const db = loadDB();
  const user = db.users.find((u) => u.id === parsed.id);
  return user ? sanitizeUser(user) : null;
}

export { ApiError };
