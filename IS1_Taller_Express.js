import express from 'express';
//var express = require('express');
var app = express();
var PORT=8080;

console.log('Express Ok! Listen('+PORT+')');
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(8080, function () {
  console.log('Example app listening on port:'+PORT);
});

