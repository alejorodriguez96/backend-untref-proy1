// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
   res.send(BD);
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
    const nuevaFruta = req.body;
    BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

// Ruta para eliminar una fruta
app.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    nuevaBD = BD.filter((fruta) => fruta.id !== id);
    if (nuevaBD.length === BD.length) {
      return res.status(404).send("Fruta no encontrada!");
    }
    guardarFrutas(nuevaBD);
    res.status(200).send("Fruta eliminada!");
});

// Ruta para actualizar una fruta
app.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const nuevaFruta = req.body;
    const resultado = BD.find((fruta) => fruta.id === id);
    if (!resultado) {
      return res.status(404).send("Fruta no encontrada!");
    }
    BD = BD.map((fruta) => {
      return fruta.id === id ? {...fruta, ...nuevaFruta} : fruta;
    });
    guardarFrutas(BD);
    res.status(200).send("Fruta actualizada!");
});

// Ruta para obtener una fruta por su id
app.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const resultado = BD.find((fruta) => fruta.id === id);
    if (!resultado) {
      return res.status(404).send("Fruta no encontrada!");
    }
    res.status(200).send(resultado);
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
