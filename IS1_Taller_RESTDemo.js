//*------------------------------------------------------------------------------------
//*
//* Server DEMO REST API (mockup)
//*
//*
//* Ingenieria de Software I
//* UADER
//
//* Dr. Pedro E. Colla
//*------------------------------------------------------------------------------------
//*--- Usar un cliente que exista en typicode https://my-json-server.typicode.com/lu7did/mesaayuda/posts/xxx
//*--- por ejemplo id=803a62c8-78c8-4b63-9106-73af216d504b

// server.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8080;

// Middleware para poder leer JSON en POST
app.use(express.json());

// URL externa fija
const URL_EXTERNA = 'https://my-json-server.typicode.com/lu7did/mesaayuda/posts/';

// --- GET /cliente?id=XXXX ---
app.get('/cliente', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Falta el parámetro id');
  }

  try {
    const response = await axios.get(URL_EXTERNA+id);
    res.send(`(GET) Cliente con id=${id}: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener datos del sitio externo');
  }
});

// --- POST /cliente ---
app.post('/cliente', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send('Falta el parámetro id en el body');
  }

  try {
    const response = await axios.get(URL_EXTERNA+id);
    res.send(`(POST) Cliente con id=${id}: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener datos del sitio externo');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

