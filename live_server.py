import http.server
import socketserver
import os
import sys
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# HTML for live reload script to inject into pages
LIVE_RELOAD_SCRIPT = """
<script type="text/javascript">
(function() {
    const timestamp = new Date().getTime();
    function checkForChanges() {
        fetch('/check-for-changes?t=' + new Date().getTime())
            .then(response => response.text())
            .then(data => {
                if (data !== timestamp.toString()) {
                    console.log('Changes detected, reloading page...');
                    window.location.reload();
                } else {
                    setTimeout(checkForChanges, 1000);
                }
            })
            .catch(err => {
                console.error('Error checking for changes:', err);
                setTimeout(checkForChanges, 1000);
            });
    }
    setTimeout(checkForChanges, 1000);
    console.log('Live reload monitoring active');
})();
</script>
"""

# Track the last modification time
last_modified_time = time.time()

class LiveReloadHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def do_GET(self):
        global last_modified_time
        
        # Handle the check-for-changes endpoint
        if self.path.startswith('/check-for-changes'):
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(str(int(last_modified_time)).encode())
            return
        
        # Serve the file
        super().do_GET()
        
        # Inject live reload script for HTML files
        if self.path.endswith('.html') or self.path == '/':
            content_type = self.headers.get('Content-Type', '')
            if 'text/html' in content_type:
                self.wfile.write(LIVE_RELOAD_SCRIPT.encode())

class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global last_modified_time
        if not event.is_directory and (event.src_path.endswith('.html') or 
                                      event.src_path.endswith('.css') or 
                                      event.src_path.endswith('.js')):
            print(f"File {event.src_path} has been modified.")
            last_modified_time = time.time()

print("Starting live reload server...")
print(f"Serving at http://localhost:{PORT}")
print("The page will automatically refresh when files are changed.")
print("Press Ctrl+C to stop the server.")

try:
    # Set up the HTTP server
    handler = LiveReloadHandler
    httpd = socketserver.TCPServer(("", PORT), handler)
    
    # Set up file watcher
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=DIRECTORY, recursive=True)
    observer.start()
    
    # Start the server
    httpd.serve_forever()
    
except KeyboardInterrupt:
    print("\nShutting down server...")
    observer.stop()
    observer.join()
    httpd.server_close()
    sys.exit(0)
