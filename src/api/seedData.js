// Datos semilla para la base de datos simulada (localStorage).
// Las portadas usan la API pública y gratuita de Open Library Covers.

export const seedBooks = [
  {
    id: "b1",
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    categoria: "Realismo mágico",
    precio: 68000,
    stock: 14,
    portada: "https://covers.openlibrary.org/b/isbn/9780307474728-L.jpg",
    descripcion:
      "La saga de la familia Buendía en el pueblo de Macondo, una de las cumbres de la literatura latinoamericana.",
  },
  {
    id: "b2",
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    categoria: "Clásico",
    precio: 72000,
    stock: 9,
    portada: "https://covers.openlibrary.org/b/isbn/9788420412146-L.jpg",
    descripcion:
      "Las aventuras del ingenioso hidalgo que decide convertirse en caballero andante, obra cumbre del español.",
  },
  {
    id: "b3",
    titulo: "1984",
    autor: "George Orwell",
    categoria: "Distopía",
    precio: 54000,
    stock: 20,
    portada: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    descripcion:
      "Una visión inquietante de un futuro totalitario donde el Gran Hermano vigila cada pensamiento.",
  },
  {
    id: "b4",
    titulo: "El Principito",
    autor: "Antoine de Saint-Exupéry",
    categoria: "Fábula",
    precio: 39000,
    stock: 30,
    portada: "https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg",
    descripcion:
      "Un piloto perdido en el desierto conoce a un pequeño príncipe venido de otro planeta.",
  },
  {
    id: "b5",
    titulo: "Rayuela",
    autor: "Julio Cortázar",
    categoria: "Vanguardia",
    precio: 61000,
    stock: 11,
    portada: "https://covers.openlibrary.org/b/isbn/9788437604572-L.jpg",
    descripcion:
      "Una novela que puede leerse en distintos órdenes, símbolo de la literatura experimental latinoamericana.",
  },
  {
    id: "b6",
    titulo: "Crimen y castigo",
    autor: "Fiódor Dostoyevski",
    categoria: "Clásico ruso",
    precio: 58000,
    stock: 8,
    portada: "https://covers.openlibrary.org/b/isbn/9788420674188-L.jpg",
    descripcion:
      "El tormento moral de Raskólnikov tras cometer un asesinato en la Rusia del siglo XIX.",
  },
  {
    id: "b7",
    titulo: "Orgullo y prejuicio",
    autor: "Jane Austen",
    categoria: "Romance",
    precio: 49000,
    stock: 17,
    portada: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    descripcion:
      "Elizabeth Bennet y el orgulloso señor Darcy protagonizan una de las historias de amor más queridas.",
  },
  {
    id: "b8",
    titulo: "La sombra del viento",
    autor: "Carlos Ruiz Zafón",
    categoria: "Misterio",
    precio: 55000,
    stock: 13,
    portada: "https://covers.openlibrary.org/b/isbn/9788408043645-L.jpg",
    descripcion:
      "Un joven descubre un libro maldito en el Cementerio de los Libros Olvidados de Barcelona.",
  },
  {
    id: "b9",
    titulo: "Fahrenheit 451",
    autor: "Ray Bradbury",
    categoria: "Ciencia ficción",
    precio: 47000,
    stock: 16,
    portada: "https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg",
    descripcion:
      "En un futuro donde los libros están prohibidos, un bombero encargado de quemarlos empieza a cuestionarse todo.",
  },
  {
    id: "b10",
    titulo: "Matar a un ruiseñor",
    autor: "Harper Lee",
    categoria: "Drama",
    precio: 51000,
    stock: 12,
    portada: "https://covers.openlibrary.org/b/isbn/9780060935467-L.jpg",
    descripcion:
      "Scout Finch narra su infancia en el sur de Estados Unidos, marcada por un juicio de profunda injusticia racial.",
  },
];

export const seedUsers = [
  {
    id: "u-admin-1",
    nombre: "Admin Principal",
    email: "admin@paginasvioleta.com",
    password: "admin123",
    telefono: "3000000000",
    direccion: "Oficina central",
    role: "admin",
    creadoEn: new Date("2026-01-01").toISOString(),
  },
  {
    id: "u-cliente-1",
    nombre: "Cliente Demo",
    email: "cliente@paginasvioleta.com",
    password: "cliente123",
    telefono: "3001234567",
    direccion: "Calle 10 # 20-30, Medellín",
    role: "cliente",
    creadoEn: new Date("2026-01-02").toISOString(),
  },
];
