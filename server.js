var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(80, function () {
  console.log('Server listening on Port 80!');
});