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
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8080;

//*--- Inicializa primitiva GET /cliente/?id=XXXXXXXXXXXXXXX
//*--- Usar un cliente que exista en typicode https://my-json-server.typicode.com/lu7did/mesaayuda/posts/xxx
//*--- por ejemplo id=803a62c8-78c8-4b63-9106-73af216d504b

app.get('/cliente', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Falta el parámetro id');
  }

  try {
    console.log('Recibido request para id='+id);

    // Llamada al sitio web externo
    const url = 'https://my-json-server.typicode.com/lu7did/mesaayuda/posts/'+id';
    const response = await axios.get(url);

    // Enviar el JSON completo
    //res.send(`Cliente con id=${id}: ${JSON.stringify(response.data)}`);
    res.send(response.data);
    
    // Para un solo campo
    // res.send(`Cliente con id=${id}: ${response.data.title}`);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener datos del sitio externo');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

