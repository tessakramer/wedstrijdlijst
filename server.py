#!/usr/bin/env python3
import http.server
import urllib.request
import os
import mimetypes

TARGET_URL = 'https://www.nederlandsefierljepbond.nl/nw_public_scripts/wedstrijdlijst.php?id_wedstrijd=5061'
PORT = 3000

class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

    def do_GET(self):
        if self.path == '/data':
            try:
                req = urllib.request.Request(TARGET_URL, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as resp:
                    data = resp.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
            return

        # Static files
        path = self.path.split('?')[0]
        if path == '/':
            path = '/index.html'
        file_path = os.path.join(os.path.dirname(__file__), path.lstrip('/'))
        if os.path.isfile(file_path):
            mime, _ = mimetypes.guess_type(file_path)
            with open(file_path, 'rb') as f:
                data = f.read()
            self.send_response(200)
            self.send_header('Content-Type', mime or 'text/plain')
            self.end_headers()
            self.wfile.write(data)
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    with http.server.HTTPServer(('', PORT), Handler) as httpd:
        print(f'Wedstrijdlijst UI draait op http://localhost:{PORT}')
        httpd.serve_forever()
