const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const server = http.createServer(async (req, res) => {
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

  // Verifica si se solicita la generación del archivo PDF
  if (filePath === './pdf') {
    // Utiliza Puppeteer para generar el archivo PDF desde el código HTML
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file://${path.join(__dirname, 'PAR.html')}`, {
      waitUntil: 'networkidle0',
    });
    const pdf = await page.pdf();
    await browser.close();

    // Envía el archivo PDF como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=recetas.pdf');
    res.end(pdf);
  } else {
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
  }
});

const PORT = process.env.PORT || 3000; // Puerto en el que se ejecutará el servidor
server.listen(PORT, () => {
  console.log(`Servidor web corriendo en http://localhost:${PORT}/`);
});