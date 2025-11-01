#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const port = parseInt(process.argv[2], 10) || 8000;
const root = process.cwd();

const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  try {
    const decoded = decodeURI(req.url.split('?')[0]);
    let filePath = path.join(root, decoded);
    // Prevent path traversal
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      if (stats.isDirectory()) {
        // look for index.html
        const index = path.join(filePath, 'index.html');
        fs.stat(index, (ie, istats) => {
          if (!ie && istats.isFile()) {
            streamFile(index, res);
          } else {
            // simple directory listing
            fs.readdir(filePath, (re, files) => {
              if (re) { res.writeHead(500); res.end('Server error'); return; }
              res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
              res.write('<h1>Directory listing for ' + decoded + '</h1>');
              res.write('<ul>');
              files.forEach(f => res.write(`<li><a href="${path.posix.join(decoded, f)}">${f}</a></li>`));
              res.end('</ul>');
            });
          }
        });
      } else {
        streamFile(filePath, res);
      }
    });
  } catch (e) {
    res.writeHead(500);
    res.end('Server error');
  }
});

function streamFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mime[ext] || 'application/octet-stream';
  res.writeHead(200, {'Content-Type': type, 'Cache-Control': 'no-store'});
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', () => { res.writeHead(500); res.end('Server error'); });
}

server.listen(port, '127.0.0.1', () => {
  console.log(`Static server running at http://127.0.0.1:${port}/ - serving ${root}`);
});
