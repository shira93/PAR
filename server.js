const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './PAR.html';
  }

  // Determina el tipo de contenido en función de la extensión del archivo
  const extname = path.extname(filePath);
  let contentType = 'text/html'; // Tipo de contenido predeterminado

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  // Lee el archivo correspondiente y responde con su contenido
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Archivo no encontrado, responde con un error 404
        res.writeHead(404);
        res.end('404 - Not Found');
      } else {
        // Otro error del servidor, responde con un error 500
        res.writeHead(500);
        res.end('500 - Internal Server Error');
      }
    } else {
      // Archivo encontrado, responde con el contenido y el tipo de contenido adecuados
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data, 'utf-8');
    }
  });
});

const PORT = process.env.PORT || 3000; // Puerto en el que se ejecutará el servidor
server.listen(PORT, () => {
  console.log(`Servidor web corriendo en http://localhost:${PORT}/`);
});
