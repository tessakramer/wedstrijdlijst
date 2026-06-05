const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const TARGET_URL = 'https://www.nederlandsefierljepbond.nl/nw_public_scripts/wedstrijdlijst.php?id_wedstrijd=5061';
const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/data') {
    const targetUrl = parsedUrl.query.url || TARGET_URL;
    https.get(targetUrl, (proxyRes) => {
      let data = '';
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(data);
      });
    }).on('error', (err) => {
      res.writeHead(500);
      res.end('Fout bij ophalen: ' + err.message);
    });
    return;
  }

  const filePath = path.join(__dirname, parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Niet gevonden');
      return;
    }
    const ext = path.extname(filePath);
    const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' }[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Wedstrijdlijst UI draait op http://localhost:${PORT}`);
});
