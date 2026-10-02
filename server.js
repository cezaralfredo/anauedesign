const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DEFAULT_PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

function openBrowser(url) {
  const start = process.platform === 'darwin' ? 'open' :
                process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${start} ${url}`, (err) => {
    if (err) {
      // Ignore error if browser cannot be opened automatically
    }
  });
}

function createPreviewServer(port) {
  const server = http.createServer((req, res) => {
    try {
      let rawPath = req.url.split('?')[0];
      let decodedPath = decodeURIComponent(rawPath);

      // Suporte legado para /v2/ caso ainda seja acessado
      if (decodedPath.startsWith('/v2/')) {
        decodedPath = decodedPath.replace('/v2/', '/');
      } else if (decodedPath === '/v2') {
        decodedPath = '/';
      }

      // Redirecionamento canônico 301 de /index.html para a raiz /
      if (rawPath === '/index.html') {
        res.writeHead(301, { 'Location': '/' });
        return res.end();
      }

      if (decodedPath === '/' || decodedPath === '') {
        decodedPath = '/index.html';
      }

      let relativePath = decodedPath.replace(/^\/+/, '');
      let filePath = path.resolve(__dirname, relativePath);

      // Prevenção de Path Traversal
      if (!filePath.startsWith(path.resolve(__dirname))) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('403 Forbidden: Acesso não autorizado.');
      }

      // Se não encontrou o arquivo direto, tenta adicionar .html (ex: /quem-somos -> /quem-somos.html)
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        if (fs.existsSync(filePath + '.html') && fs.statSync(filePath + '.html').isFile()) {
          filePath = filePath + '.html';
        }
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME[ext] || 'application/octet-stream',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '0',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        const errorPage = path.join(__dirname, '404.html');
        if (fs.existsSync(errorPage)) {
          res.writeHead(404, {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '0'
          });
          fs.createReadStream(errorPage).pipe(res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`404 Not Found: ${req.url}`);
        }
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`500 Internal Server Error: ${err.message}`);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Porta ${port} em uso, tentando porta ${port + 1}...`);
      createPreviewServer(port + 1);
    } else {
      console.error('Erro no servidor:', err);
    }
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}/`;
    console.log('==================================================');
    console.log(`  Site Anauê Design rodando com sucesso!`);
    console.log(`  Acesse no navegador: ${url}`);
    console.log('==================================================');

    // Abre o navegador automaticamente ao iniciar
    openBrowser(url);
  });
}

createPreviewServer(DEFAULT_PORT);