#!/usr/bin/env python3
"""
Simple HTTP server to serve generated TTS files from Railway
"""
import http.server
import socketserver
import os

PORT = int(os.getenv('PORT', 8080))
DIRECTORY = os.getenv('SERVE_DIR', '/app/public')

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Enable CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

print(f"Serving {DIRECTORY} on port {PORT}")
print(f"Access files at: http://localhost:{PORT}/")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
