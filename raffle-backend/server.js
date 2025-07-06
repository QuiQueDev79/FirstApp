import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors());

// Inicializar SQLite
const dbPromise = open({
  filename: "./raffle.db",
  driver: sqlite3.Database,
});

// Ruta para reservar número
app.post("/reserve", async (req, res) => {
  const db = await dbPromise;
  const { name, surname, phone, number } = req.body;

  try {
    await db.run(
      "INSERT INTO participants (name, surname, phone, number) VALUES (?, ?, ?, ?)",
      [name, surname, phone, number]
    );

    // Llamada a CallMeBot (ajusta tu API key)
    await axios.get(
      `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(
        `Felicidades. Ya estás participando en el sorteo a beneficio del Tío Ramón Araujo. Tu número es el ${number}`
      )}&apikey=YOUR_CALLMEBOT_API_KEY`
    );

    res.status(200).json({ message: "Número reservado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para ver números ocupados
app.get("/numbers", async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all("SELECT number FROM participants");
  res.json(rows);
});

// Lanzar servidor en puerto 3001
app.listen(3001, async () => {
  const db = await dbPromise;
  await db.run(
    "CREATE TABLE IF NOT EXISTS participants (id INTEGER PRIMARY KEY, name TEXT, surname TEXT, phone TEXT, number INTEGER UNIQUE)"
  );
  console.log("Servidor escuchando en http://localhost:3001");
});
