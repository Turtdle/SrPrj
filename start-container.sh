#!/bin/sh

# Create a log file
LOGFILE="/var/log/container-startup.log"
touch $LOGFILE
chmod 666 $LOGFILE

# Log function
log() {
  echo "[$(date)] $1" | tee -a $LOGFILE
}

log "===== CONTAINER STARTUP DEBUG ====="
log "Container started with the following environment:"
env | grep -v PASSWORD | grep -v KEY | sort >> $LOGFILE

# Check if source directory exists
log "Checking if /app/data directory exists:"
if [ -d "/app/data" ]; then
  log "✓ Directory /app/data exists"
  log "Contents of /app/data:"
  ls -la /app/data/ | tee -a $LOGFILE
else
  log "✗ ERROR: Directory /app/data does not exist!"
fi

# Check if source file exists
log "Checking if source data.json exists:"
if [ -f "/app/data/data.json" ]; then
  log "✓ Source file /app/data/data.json exists"
  log "File size: $(stat -c%s /app/data/data.json) bytes"
  log "Source data.json contents (first 100 chars):"
  head -c 100 /app/data/data.json | tee -a $LOGFILE
  log "..."
else
  log "✗ ERROR: Source file /app/data/data.json does not exist!"
  log "Creating an empty placeholder data.json"
  echo '{"name":"Test User","contact":{"email":"test@example.com","phone":"123-456-7890","location":"Anywhere, USA"},"education":[{"institution":"Test University","degree":"Test Degree","graduation_date":"2025","gpa":"4.0","relevant_coursework":["Course 1"]}],"experience":[{"position":"Test Position","company":"Test Company","duration":"2023-Present","location":"Test Location","responsibilities":["Test responsibility"]}],"skills":{"languages":["Test Language"],"tools":["Test Tool"]},"projects":[{"name":"Test Project","description":"Test Description","technologies":["Test Tech"]}]}' > /tmp/data.json
  cp /tmp/data.json /app/data/data.json
  log "Created placeholder data.json"
fi

# Check destination directory
log "Checking destination directory:"
if [ -d "/usr/share/nginx/html" ]; then
  log "✓ Destination directory /usr/share/nginx/html exists"
  log "Contents before copy:"
  ls -la /usr/share/nginx/html/ | tee -a $LOGFILE
else
  log "✗ ERROR: Destination directory /usr/share/nginx/html does not exist!"
  log "Creating destination directory"
  mkdir -p /usr/share/nginx/html
fi

# Copy resume data to the web directory
log "Copying data.json to web directory"
cp /app/data/data.json /usr/share/nginx/html/data.json
if [ $? -eq 0 ]; then
  log "✓ Copy operation successful"
else
  log "✗ ERROR: Copy operation failed with exit code $?"
fi

# Ensure proper permissions
log "Setting file permissions"
chmod 644 /usr/share/nginx/html/data.json
if [ $? -eq 0 ]; then
  log "✓ Permission change successful"
else
  log "✗ ERROR: Permission change failed with exit code $?"
fi

# Debug: Verify the copy worked
log "Verifying the copy worked:"
if [ -f "/usr/share/nginx/html/data.json" ]; then
  log "✓ Destination file /usr/share/nginx/html/data.json exists"
  log "File size: $(stat -c%s /usr/share/nginx/html/data.json) bytes"
  log "Contents of web directory after copy:"
  ls -la /usr/share/nginx/html/ | tee -a $LOGFILE
  log "Copied data.json contents (first 100 chars):"
  head -c 100 /usr/share/nginx/html/data.json | tee -a $LOGFILE
  log "..."
else
  log "✗ ERROR: Destination file /usr/share/nginx/html/data.json does not exist after copy!"
fi

# Create a simple HTML page to view the log
log "Creating debug page"
cat > /usr/share/nginx/html/debug.html << EOF
<!DOCTYPE html>
<html>
<head>
  <title>Container Debug Info</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    pre { background: #f4f4f4; padding: 10px; overflow: auto; }
  </style>
</head>
<body>
  <h1>Container Debug Information</h1>
  <h2>Startup Log</h2>
  <pre id="log">Loading...</pre>
  
  <h2>data.json Content</h2>
  <pre id="json">Loading...</pre>
  
  <script>
    // Fetch and display the log
    fetch('/container-startup.log')
      .then(response => response.text())
      .then(data => {
        document.getElementById('log').textContent = data;
      })
      .catch(error => {
        document.getElementById('log').textContent = 'Error fetching log: ' + error;
      });
      
    // Fetch and display the JSON
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        document.getElementById('json').textContent = JSON.stringify(data, null, 2);
      })
      .catch(error => {
        document.getElementById('json').textContent = 'Error fetching JSON: ' + error;
      });
  </script>
</body>
</html>
EOF

# Copy the log file to a location accessible by nginx
log "Making log file accessible via web"
cp $LOGFILE /usr/share/nginx/html/container-startup.log
chmod 644 /usr/share/nginx/html/container-startup.log

# Start nginx
log "Starting nginx..."
nginx -g "daemon off;"