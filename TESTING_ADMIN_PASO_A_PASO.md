🧪 GUÍA PASO A PASO: TESTEAR FUNCIONALIDADES DE ADMIN
====================================================

Sigue estos pasos para verificar que todas las funcionalidades admin funcionan correctamente.

═══════════════════════════════════════════════════════════════════════════════

📋 PREPARACIÓN INICIAL
─────────────────────────────────────────────────────────────────────────────

1. Asegúrate que el proyecto está corriendo:
   ```bash
   npm run dev
   ```
   ✅ URL: http://localhost:5173

2. Abre DevTools (F12):
   - Tab: Console (para ver mensajes)
   - Tab: Application → Local Storage (para verificar datos)

═══════════════════════════════════════════════════════════════════════════════

✅ TEST 1: VERIFICAR LOCALSTORAGE AL LOGIN
─────────────────────────────────────────────────────────────────────────────

Paso 1: Ir a /login
├─ URL: http://localhost:5173/login
└─ Verifica que el formulario de login está visible

Paso 2: Ingresa credenciales de ADMIN
├─ Email: admin@paginasvioleta.com
├─ Contraseña: admin123
└─ Haz clic en "Ingresar"

Paso 3: Verifica localStorage (DevTools)
├─ Application → Local Storage → libreria-online:8080
├─ Busca: "pv_token"
├─ ✅ Debe existir con contenido tipo base64
└─ Copia el valor para verificar después

Paso 4: En la consola, ejecuta:
```javascript
import * as api from './api/apiClient';
const token = localStorage.getItem("pv_token");
console.log("Token:", token);

const user = api.getUserFromToken(token);
console.log("Usuario:", user);
console.log("Rol:", user.role);  // Debe ser "admin"
```

✅ Resultado esperado:
   • localStorage tiene "pv_token"
   • user.role === "admin"
   • user.nombre === "Admin"

═══════════════════════════════════════════════════════════════════════════════

✅ TEST 2: VER LISTADO DE CLIENTES
─────────────────────────────────────────────────────────────────────────────

Paso 1: Navega a clientes
├─ URL: http://localhost:5173/admin/clientes
├─ O haz clic en: Navbar → "Admin" → "Clientes"
└─ Espera a que cargue la tabla

Paso 2: Verifica el contenido
├─ ✅ Título: "Clientes registrados"
├─ ✅ Subtítulo: "N cliente(s) en total"
├─ ✅ Tabla con columnas:
│   - Nombre
│   - Email
│   - Teléfono
│   - Dirección
│   - Registrado
└─ ✅ Al menos 1 cliente visible (está el demo cliente)

Paso 3: Verifica datos del cliente demo
├─ Nombre: "Cliente Demo"
├─ Email: "cliente@paginasvioleta.com"
├─ Estado: Visible en la tabla
└─ Filtrado correctamente (solo role="cliente")

✅ Resultado esperado:
   • Tabla carga sin errores
   • Se muestra al menos 1 cliente
   • Columnas tienen datos

═══════════════════════════════════════════════════════════════════════════════

✅ TEST 3: CREAR NUEVO ADMINISTRADOR
─────────────────────────────────────────────────────────────────────────────

Paso 1: Navega a crear admin
├─ URL: http://localhost:5173/admin/crear-admin
├─ O haz clic en: Navbar → "Admin" → "Crear admin"
└─ Verifica que el formulario está visible

Paso 2: Prueba validación - Campo vacío
├─ Deja todos los campos vacíos
├─ Haz clic en "Crear administrador"
├─ ✅ Debe mostrar errores:
│   - "Ingresa el nombre completo"
│   - "Ingresa un email válido"
│   - "Mínimo 6 caracteres"
└─ Botón NO se envía

Paso 3: Prueba validación - Email inválido
├─ Nombre: "Nuevo Admin"
├─ Email: "no-es-email" (inválido)
├─ Contraseña: "123456"
├─ Haz clic en "Crear administrador"
├─ ✅ Debe mostrar error: "Ingresa un email válido"
└─ Botón NO se envía

Paso 4: Prueba validación - Contraseña corta
├─ Nombre: "Nuevo Admin"
├─ Email: "nuevo@admin.com"
├─ Contraseña: "123" (menos de 6)
├─ Haz clic en "Crear administrador"
├─ ✅ Debe mostrar error: "Mínimo 6 caracteres"
└─ Botón NO se envía

Paso 5: Crea un admin válido
├─ Nombre: "Admin Test"
├─ Email: "admin-test@paginasvioleta.com"
├─ Contraseña: "admin123"
├─ Teléfono: "300-555-1234" (opcional)
├─ Haz clic en "Crear administrador"
├─ ✅ Debe mostrar toast: "Administrador Admin Test creado con éxito"
├─ ✅ Formulario se limpia
└─ ✅ El nuevo admin es visible en /admin/clientes (si tiene sesión)

Paso 6: Intenta login con el nuevo admin
├─ Haz logout (click en usuario → Logout)
├─ Ve a /login
├─ Ingresa credenciales del nuevo admin:
│   - Email: admin-test@paginasvioleta.com
│   - Contraseña: admin123
├─ ✅ Debe permitir login
├─ ✅ Redirige a /admin
└─ ✅ Token guardado en localStorage

✅ Resultado esperado:
   • Validación funciona correctamente
   • Se puede crear un nuevo admin
   • El nuevo admin puede hacer login

═══════════════════════════════════════════════════════════════════════════════

✅ TEST 4: GESTIONAR PEDIDOS - APROBAR/RECHAZAR
─────────────────────────────────────────────────────────────────────────────

Paso 1: Prepara datos (crea un pedido como cliente)
├─ Haz logout de admin
├─ Haz login como CLIENTE:
│   - Email: cliente@paginasvioleta.com
│   - Contraseña: cliente123
├─ Ve a /tienda
├─ Agrega un libro al carrito
├─ Ve a /carrito
├─ Haz clic en "Confirmar pedido"
├─ ✅ Toast: "¡Pedido confirmado!"
├─ ✅ El pedido se crea en estado "Pendiente"
└─ Guarda el ID del pedido (último dígito)

Paso 2: Haz login de nuevo como ADMIN
├─ Haz logout del cliente
├─ Ve a /login
├─ Ingresa credenciales de admin:
│   - Email: admin@paginasvioleta.com
│   - Contraseña: admin123
├─ ✅ Token restaurado en localStorage
└─ ✅ Redirige a /admin

Paso 3: Ve a la lista de pedidos
├─ URL: http://localhost:5173/admin/pedidos
├─ O haz clic en: Navbar → "Admin" → "Pedidos"
├─ ✅ Tabla carga con pedidos
├─ ✅ El pedido recién creado aparece en estado "Pendiente"
└─ Verifica que el selector de filtros funciona:
   - Todos: Muestra todos los pedidos
   - Pendiente: Muestra solo pendientes
   - Aprobado: Muestra solo aprobados

Paso 4: Haz clic en "Ver detalle" del pedido
├─ Selecciona el pedido que acabas de crear
├─ Haz clic en "Ver detalle"
├─ ✅ Navega a: /admin/pedidos/:id
├─ ✅ Muestra detalles del pedido:
│   - ID y fecha
│   - Estado actual: "Pendiente"
│   - Información del cliente
│   - Artículos del pedido
│   - Total
└─ ✅ StatusBadge muestra color amarillo/naranja (Pendiente)

Paso 5: Prueba APROBAR el pedido
├─ Haz clic en el botón "Aprobar"
├─ ✅ Botón se desactiva durante actualización
├─ ✅ Toast: "Pedido marcado como Aprobado"
├─ ✅ StatusBadge cambia a color verde
├─ ✅ Botón "Marcar enviado" se habilita
└─ ✅ Botón "Aprobar" se desactiva

Paso 6: Prueba ENVIAR el pedido
├─ Haz clic en "Marcar enviado"
├─ ✅ Toast: "Pedido marcado como Enviado"
├─ ✅ StatusBadge cambia a color azul
├─ ✅ Botón "Marcar entregado" se habilita
└─ ✅ Botones "Aprobar" y "Rechazar" se deshabilitan

Paso 7: Prueba ENTREGAR el pedido
├─ Haz clic en "Marcar entregado"
├─ ✅ Toast: "Pedido marcado como Entregado"
├─ ✅ StatusBadge cambia a color púrpura
└─ ✅ Todos los botones de acción se deshabilitan (orden completada)

Paso 8: Prueba RECHAZAR (en otro pedido)
├─ Vuelve a /admin/pedidos
├─ Crea otro pedido como cliente (repite pasos 1-2)
├─ Abre el nuevo pedido en detalles
├─ Haz clic en "Rechazar"
├─ ✅ Toast: "Pedido marcado como Rechazado"
├─ ✅ StatusBadge cambia a color rojo
└─ ✅ Otros botones se deshabilitan

✅ Resultado esperado:
   • La transición de estados funciona correctamente
   • Botones se habilitan/deshabilitan según lógica
   • Toast confirma cada acción
   • StatusBadge cambia de color según estado
   • Los estados persisten (recarga la página y verifica)

═══════════════════════════════════════════════════════════════════════════════

✅ TEST 5: PERSISTENCIA - RECARGA Y VERIFICACIÓN
─────────────────────────────────────────────────────────────────────────────

Paso 1: Estando en /admin/pedidos, recarga la página
├─ Presiona F5 o Ctrl+R
├─ ✅ Debes permanecer autenticado (token persiste)
├─ ✅ Datos del pedido están ahí
└─ Verifica localStorage: "pv_token" sigue existiendo

Paso 2: Cierra la pestaña del navegador completamente
├─ Cierra la pestaña
├─ Abre nuevamente el navegador
├─ Ve a http://localhost:5173
├─ ✅ Debes estar autenticado aún (sesión persiste)
├─ ✅ Navega a /admin
└─ ✅ Tienes acceso (token y rol están en localStorage)

Paso 3: Verifica que los cambios persisten
├─ Ve a /admin/pedidos/:id (el pedido que modificaste)
├─ ✅ El estado debe ser el que dejaste (no vuelve a Pendiente)
├─ ✅ Los cambios se guardaron correctamente
└─ ✅ Los datos no están solo en memoria

Paso 4: Logout y verifica limpieza
├─ Haz logout
├─ Verifica localStorage: "pv_token" debe DESAPARECER
├─ ✅ localStorage.removeItem(TOKEN_KEY) se ejecutó
└─ Intenta acceder a /admin: debes ser redirigido a /login

✅ Resultado esperado:
   • Persistencia de sesión funciona
   • Token se persiste correctamente
   • Logout limpia el localStorage
   • Acceso protegido funciona

═══════════════════════════════════════════════════════════════════════════════

✅ TEST 6: PROTECCIÓN DE RUTAS
─────────────────────────────────────────────────────────────────────────────

Paso 1: Sin autenticar
├─ Intenta acceder a: http://localhost:5173/admin
├─ ✅ Debes ser redirigido a /login
└─ Mensaje: (ruta protegida)

Paso 2: Autenticado como CLIENTE
├─ Haz login como cliente:
│   - Email: cliente@paginasvioleta.com
│   - Contraseña: cliente123
├─ Intenta acceder a: http://localhost:5173/admin
├─ ✅ Debes ser redirigido (acceso denegado)
└─ Verifica: isAdmin = false → acceso bloqueado

Paso 3: Autenticado como ADMIN
├─ Haz login como admin:
│   - Email: admin@paginasvioleta.com
│   - Contraseña: admin123
├─ Ve a: http://localhost:5173/admin
├─ ✅ Acceso permitido
└─ Verificar: isAdmin = true → acceso permitido

✅ Resultado esperado:
   • Rutas protegidas funcionan correctamente
   • El rol se verifica correctamente
   • Clientes no pueden acceder a admin
   • Admins pueden acceder

═══════════════════════════════════════════════════════════════════════════════

✅ TEST 7: FLUJO COMPLETO SIMULADO
─────────────────────────────────────────────────────────────────────────────

Este test simula un día completo de un administrador:

1. [09:00] INICIO DE SESIÓN
   ├─ Abre http://localhost:5173
   ├─ Haz clic en "Inicia sesión"
   ├─ Ingresa: admin@paginasvioleta.com / admin123
   └─ ✅ Autenticado, token en localStorage

2. [09:10] REVISAR CLIENTES
   ├─ Navega a /admin/clientes
   ├─ ✅ Ve el listado de clientes registrados
   └─ Verifica: al menos el cliente demo está registrado

3. [09:30] CREAR NUEVO ADMIN
   ├─ Navega a /admin/crear-admin
   ├─ Crea: "María García" / maria-garcia@mail.com / garcia123
   ├─ ✅ Éxito
   └─ Anota: nuevo admin creado

4. [10:00] GESTIONAR PEDIDOS
   ├─ Navega a /admin/pedidos
   ├─ Ve el listado con filtro "Todos"
   ├─ ✅ Muestra pedidos en varios estados
   └─ Cuenta: N pedidos en total

5. [10:15] APROBAR UN PEDIDO
   ├─ Abre un pedido en estado "Pendiente"
   ├─ Haz clic: "Aprobar"
   ├─ ✅ Estado cambio a "Aprobado"
   └─ Toast confirma

6. [10:30] ENVIAR EL PEDIDO
   ├─ Mismo pedido, haz clic: "Marcar enviado"
   ├─ ✅ Estado: "Enviado"
   └─ Toast confirma

7. [15:00] ENTREGAR PEDIDO
   ├─ Mismo pedido, haz clic: "Marcar entregado"
   ├─ ✅ Estado: "Entregado"
   └─ Pedido completado

8. [16:00] RECARGA DE PÁGINA
   ├─ Presiona F5
   ├─ ✅ Sigue autenticado
   ├─ ✅ Va a /admin
   └─ Token persiste

9. [17:00] CIERRE DE SESIÓN
   ├─ Haz clic en nombre de usuario
   ├─ Selecciona: "Logout"
   ├─ ✅ Redirigido a homepage
   └─ ✅ Token eliminado del localStorage

═══════════════════════════════════════════════════════════════════════════════

✅ CHECKLIST FINAL DE TESTING
─────────────────────────────────────────────────────────────────────────────

Funcionalidades verificadas:

✅ TEST 1: localStorage
   ❑ Token se guarda al login
   ❑ Token se restaura al recargar
   ❑ Rol está incluido en usuario
   ❑ Token se elimina al logout

✅ TEST 2: Listar clientes
   ❑ Página /admin/clientes funciona
   ❑ Tabla muestra clientes
   ❑ Solo muestra role="cliente"
   ❑ Datos correctos

✅ TEST 3: Crear admin
   ❑ Formulario valida campos
   ❑ Muestra errores correctamente
   ❑ Se puede crear nuevo admin
   ❑ Nuevo admin puede hacer login

✅ TEST 4: Gestionar pedidos
   ❑ Página /admin/pedidos funciona
   ❑ Filtros por estado funcionan
   ❑ Página de detalle /admin/pedidos/:id funciona
   ❑ Botón "Aprobar" funciona
   ❑ Botón "Rechazar" funciona
   ❑ Botón "Enviar" funciona
   ❑ Botón "Entregar" funciona
   ❑ Estados cambian correctamente
   ❑ Toast confirma cambios
   ❑ StatusBadge cambia de color

✅ TEST 5: Persistencia
   ❑ Recarga persiste sesión
   ❑ Datos persisten después de recarga
   ❑ Cerrar navegador y abrir mantiene sesión

✅ TEST 6: Rutas protegidas
   ❑ Sin auth → redirige a /login
   ❑ Cliente → no puede acceder a /admin
   ❑ Admin → puede acceder a /admin

✅ TEST 7: Flujo completo
   ❑ Login → ver clientes → crear admin → gestionar pedidos → logout

═══════════════════════════════════════════════════════════════════════════════

🎉 ¡TESTING COMPLETADO EXITOSAMENTE!

Si todos estos tests pasan, tu aplicación está lista para producción. ✅

═══════════════════════════════════════════════════════════════════════════════
