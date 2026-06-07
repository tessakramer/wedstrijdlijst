const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

http.createServer(async (req, res) => {
  let urlPath = req.url.split('?')[0];

  // Netlify functions
  if (urlPath.startsWith('/.netlify/functions/')) {
    const name = urlPath.replace('/.netlify/functions/', '');
    const fnPath = path.join(ROOT, 'functions', name + '.js');
    try {
      const mod = await import(fnPath);
      const fn = mod.default;
      const fakeReq = { url: `http://localhost:${PORT}${req.url}` };
      const result = await fn(fakeReq);
      const body = await result.text();
      const ct = result.headers?.get('Content-Type') || 'text/plain';
      res.writeHead(result.status || 200, { 'Content-Type': ct, 'Access-Control-Allow-Origin': '*' });
      res.end(body);
    } catch (err) {
      res.writeHead(500);
      res.end('Function error: ' + err.message);
    }
    return;
  }

  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Serving on http://localhost:${PORT}`));
