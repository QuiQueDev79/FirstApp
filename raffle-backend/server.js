import dotenv from 'dotenv';
dotenv.config();

import twilio from 'twilio';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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

    // Llamada a Twilio
    await client.messages.create({
  from: process.env.TWILIO_WHATSAPP_NUMBER,
  to: `whatsapp:${phone}`,  // asegúrate de que esté en formato internacional, ej: +34600000000
  body: `Hola ${name}, ya estás participando en el sorteo a beneficio del Tío Ramón Araujo con el número ${number}. ¡Gracias por colaborar!`
});


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

// Lanzar servidor en Port para que render lo publique
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
