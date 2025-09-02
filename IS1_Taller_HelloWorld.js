//*---------------------------------------------------------------------------
//*
//* Servidor sencillo NodeJS
//*
//* Taller - Ingeniería de Software I
//* UADER
//*
//* Dr. Pedro E. Colla
//*---------------------------------------------------------------------------
const http = require('http')
const port = 8080

// Crea un objeto servidor
const server = http.createServer(function (req, res) {

// Cuando recibe un requerimiento escribe la respuesta
res.write('Hello World')
console.log("El servidor ha contestado exitosamente Hello World!");

// Fin de la respuesta, cierra la conexión
res.end()
})

//*-----------------------------------------------------------------
//* Definición del servidor, bind con puerto y comienza LISTEN
//*-----------------------------------------------------------------
server.listen(port, function (error) {
if (error) {
console.log('Something went wrong', error);
}
else {
console.log('Server is listening on port' + port);
}
})
