import { describe, it, expect, beforeEach } from "@jest/globals";

// Importar después de limpiar localStorage para usar datos frescos
import * as api from "../api/apiClient";

const seedData = {
  users: [
    { id: "u-admin-1", nombre: "Admin", email: "admin@test.com", password: "admin123", role: "admin", telefono: "3000000000", direccion: "", creadoEn: new Date().toISOString() },
    { id: "u-cliente-1", nombre: "Cliente", email: "cliente@test.com", password: "cliente123", role: "cliente", telefono: "3001234567", direccion: "Calle 123", creadoEn: new Date().toISOString() },
  ],
  products: [
    { id: "b1", titulo: "Libro A", autor: "Autor A", categoria: "Ficción", precio: 50000, stock: 10, portada: "", descripcion: "Desc A" },
    { id: "b2", titulo: "Libro B", autor: "Autor B", categoria: "No ficción", precio: 40000, stock: 5, portada: "", descripcion: "Desc B" },
  ],
  orders: [],
};

function resetDB() {
  localStorage.setItem("pv_db_v1", JSON.stringify(seedData));
  // Quitar token
  localStorage.removeItem("pv_token");
}

describe("apiClient", () => {
  beforeEach(() => {
    resetDB();
  });

  describe("registerClient", () => {
    it("registra un nuevo cliente y retorna token", async () => {
      const result = await api.registerClient({ nombre: "Nuevo", email: "nuevo@test.com", password: "pass123" });
      expect(result).toHaveProperty("token");
      expect(result.user).toHaveProperty("role", "cliente");
      expect(result.user).not.toHaveProperty("password");
    });

    it("lanza error si el email ya existe", async () => {
      await expect(
        api.registerClient({ nombre: "Test", email: "cliente@test.com", password: "pass123" })
      ).rejects.toThrow("Ya existe");
    });

    it("lanza error si faltan campos obligatorios", async () => {
      await expect(api.registerClient({ nombre: "", email: "", password: "" })).rejects.toThrow("obligatorios");
    });
  });

  describe("login", () => {
    it("inicia sesión con credenciales válidas", async () => {
      const result = await api.login({ email: "admin@test.com", password: "admin123" });
      expect(result).toHaveProperty("token");
      expect(result.user.role).toBe("admin");
    });

    it("lanza error con credenciales inválidas", async () => {
      await expect(api.login({ email: "admin@test.com", password: "wrong" })).rejects.toThrow("incorrectos");
    });
  });

  describe("getProducts", () => {
    it("retorna todos los productos", async () => {
      const products = await api.getProducts();
      expect(products).toHaveLength(2);
    });
  });

  describe("CRUD productos (admin)", () => {
    let adminToken;

    beforeEach(async () => {
      const result = await api.login({ email: "admin@test.com", password: "admin123" });
      adminToken = result.token;
    });

    it("crea un producto nuevo", async () => {
      const product = await api.createProduct(
        { titulo: "Nuevo", autor: "Autor", categoria: "Test", precio: 30000, stock: 3, portada: "", descripcion: "" },
        adminToken
      );
      expect(product).toHaveProperty("id");
      expect(product.titulo).toBe("Nuevo");
    });

    it("actualiza un producto", async () => {
      const updated = await api.updateProduct("b1", { titulo: "Libro Actualizado" }, adminToken);
      expect(updated.titulo).toBe("Libro Actualizado");
    });

    it("elimina un producto", async () => {
      await api.deleteProduct("b1", adminToken);
      const products = await api.getProducts();
      expect(products).toHaveLength(1);
    });

    it("lanza error al actualizar producto inexistente", async () => {
      await expect(
        api.updateProduct("no-existe", { titulo: "X" }, adminToken)
      ).rejects.toThrow("no encontrado");
    });
  });

  describe("Pedidos", () => {
    let clienteToken;
    let adminToken;

    beforeEach(async () => {
      const admin = await api.login({ email: "admin@test.com", password: "admin123" });
      adminToken = admin.token;
      const cliente = await api.login({ email: "cliente@test.com", password: "cliente123" });
      clienteToken = cliente.token;
    });

    it("crea un pedido", async () => {
      const order = await api.createOrder([{ productId: "b1", titulo: "Libro A", precio: 50000, cantidad: 2 }], clienteToken);
      expect(order).toHaveProperty("id");
      expect(order.total).toBe(100000);
      expect(order.estado).toBe("Pendiente");
    });

    it("obtiene pedidos del usuario", async () => {
      await api.createOrder([{ productId: "b1", titulo: "Libro A", precio: 50000, cantidad: 1 }], clienteToken);
      const orders = await api.getUserOrders(clienteToken);
      expect(orders).toHaveLength(1);
    });

    it("admin obtiene todos los pedidos", async () => {
      await api.createOrder([{ productId: "b1", titulo: "Libro A", precio: 50000, cantidad: 1 }], clienteToken);
      const allOrders = await api.getAllOrders(adminToken);
      expect(allOrders).toHaveLength(1);
    });

    it("admin puede cambiar estado del pedido", async () => {
      const order = await api.createOrder([{ productId: "b1", titulo: "Libro A", precio: 50000, cantidad: 1 }], clienteToken);
      const updated = await api.updateOrderStatus(order.id, "Aprobado", adminToken);
      expect(updated.estado).toBe("Aprobado");
    });
  });

  describe("Usuarios (admin)", () => {
    let adminToken;

    beforeEach(async () => {
      const result = await api.login({ email: "admin@test.com", password: "admin123" });
      adminToken = result.token;
    });

    it("retorna todos los usuarios", async () => {
      const users = await api.getUsers(adminToken);
      expect(users).toHaveLength(2);
      users.forEach((u) => {
        expect(u).not.toHaveProperty("password");
      });
    });

    it("permite crear admin", async () => {
      const newAdmin = await api.registerAdmin(
        { nombre: "Nuevo Admin", email: "nuevoadmin@test.com", password: "pass123", telefono: "" },
        adminToken
      );
      expect(newAdmin.role).toBe("admin");
      expect(newAdmin).not.toHaveProperty("password");
    });

    it("lanza error al crear admin con email existente", async () => {
      await expect(
        api.registerAdmin({ nombre: "Test", email: "admin@test.com", password: "pass123", telefono: "" }, adminToken)
      ).rejects.toThrow("Ya existe");
    });
  });

  describe("getUserFromToken", () => {
    it("retorna null si el token es inválido", () => {
      expect(api.getUserFromToken(null)).toBeNull();
      expect(api.getUserFromToken("token-invalido")).toBeNull();
    });

    it("retorna usuario para token válido", async () => {
      const result = await api.login({ email: "cliente@test.com", password: "cliente123" });
      const user = api.getUserFromToken(result.token);
      expect(user).toHaveProperty("email", "cliente@test.com");
      expect(user).not.toHaveProperty("password");
    });
  });
});