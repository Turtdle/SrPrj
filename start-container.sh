#!/bin/sh

LOGFILE="/var/log/container-startup.log"
DEBUG_FILE="/var/log/container-debug.log"
touch $LOGFILE $DEBUG_FILE
chmod 666 $LOGFILE $DEBUG_FILE

log() {
  echo "[$(date)] $1" | tee -a $LOGFILE
}

debug() {
  echo "[DEBUG] $(date): $1" | tee -a $DEBUG_FILE
}

log "===== CONTAINER STARTUP DEBUG ====="
log "Container started with the following environment:"
env | grep -v PASSWORD | grep -v KEY | sort >> $LOGFILE

debug "Creating complete inventory of filesystem:"
find / -type f -name "*.json" 2>/dev/null | tee -a $DEBUG_FILE
debug "All mounted volumes:"
mount | tee -a $DEBUG_FILE
debug "Docker container ID:"
cat /etc/hostname | tee -a $DEBUG_FILE
debug "Container IP address:"
ip addr | grep "inet " | tee -a $DEBUG_FILE
debug "Current directory:"
pwd | tee -a $DEBUG_FILE
debug "Current directory contents:"
ls -la | tee -a $DEBUG_FILE

log "Searching for data.json in various locations:"
debug "Starting search for data.json files..."

for location in "/usr/share/nginx/html/data.json" "/app/data.json" "/data.json" "/app/data/data.json" "data.json" "../data.json"; do
  log "Checking $location"
  debug "Checking location: $location"
  
  dir=$(dirname "$location")
  if [ -d "$dir" ]; then
    debug "Directory $dir exists"
    debug "Contents of $dir:"
    ls -la "$dir" | tee -a $DEBUG_FILE
  else
    debug "Directory $dir does not exist"
  fi
  
  if [ -f "$location" ]; then
    log "✓ Found data.json at: $location"
    debug "File $location exists"
    debug "File permissions:"
    ls -la "$location" | tee -a $DEBUG_FILE
    debug "File size: $(stat -c%s $location) bytes"
    debug "File content (first 200 chars):"
    head -c 200 "$location" | tee -a $DEBUG_FILE
    debug "File is readable: $([ -r "$location" ] && echo "Yes" || echo "No")"
    
    log "File size: $(stat -c%s $location) bytes"
    log "Content preview (first 100 chars):"
    head -c 100 "$location" | tee -a $LOGFILE
    log ""
    
    debug "Validating JSON structure:"
    if cat "$location" | grep -q "^{.*}$"; then
      debug "File appears to be valid JSON (basic check)"
    else
      debug "File does not appear to be valid JSON (basic check)"
    fi
    
    DATA_JSON_PATH="$location"
    debug "Setting DATA_JSON_PATH to $DATA_JSON_PATH"
    break
  else
    debug "File $location does not exist"
  fi
done

if [ -z "$DATA_JSON_PATH" ]; then
  log "Searching entire container for data.json..."
  debug "DATA_JSON_PATH is empty, performing filesystem search"
  
  FOUND_FILES=$(find / -name "data.json" -type f 2>/dev/null)
  if [ -n "$FOUND_FILES" ]; then
    log "Found data.json at these locations:"
    echo "$FOUND_FILES" | tee -a $LOGFILE
    debug "Found files:"
    echo "$FOUND_FILES" | tee -a $DEBUG_FILE
    
    for found_file in $FOUND_FILES; do
      debug "Examining file: $found_file"
      debug "File size: $(stat -c%s $found_file) bytes"
      debug "File permissions:"
      ls -la "$found_file" | tee -a $DEBUG_FILE
      debug "File content preview:"
      head -c 200 "$found_file" | tee -a $DEBUG_FILE
      debug "File is readable: $([ -r "$found_file" ] && echo "Yes" || echo "No")"
      
      log "Checking $found_file - size: $(stat -c%s $found_file) bytes"
      log "Content preview:"
      head -c 100 "$found_file" | tee -a $LOGFILE
      log ""
    done
    
    DATA_JSON_PATH=$(echo "$FOUND_FILES" | head -n 1)
    log "Using first found location: $DATA_JSON_PATH"
    debug "Selected DATA_JSON_PATH: $DATA_JSON_PATH"
  else
    log "✗ Could not find data.json anywhere in the container"
    debug "No data.json files found in filesystem search"
  fi
fi

if [ -z "$DATA_JSON_PATH" ]; then
  log "Creating a placeholder data.json"
  debug "DATA_JSON_PATH is still empty, creating placeholder"
  DATA_JSON_PATH="/usr/share/nginx/html/data.json"
  echo '{"name":"Test User","contact":{"email":"test@example.com","phone":"123-456-7890","location":"Anywhere, USA"},"education":[{"institution":"Test University","degree":"Test Degree","graduation_date":"2025","gpa":"4.0","relevant_coursework":["Course 1"]}],"experience":[{"position":"Test Position","company":"Test Company","duration":"2023-Present","location":"Test Location","responsibilities":["Test responsibility"]}],"skills":{"languages":["Test Language"],"tools":["Test Tool"]},"projects":[{"name":"Test Project","description":"Test Description","technologies":["Test Tech"]}]}' > "$DATA_JSON_PATH"
  log "Created placeholder at $DATA_JSON_PATH"
  debug "Placeholder created at $DATA_JSON_PATH"
else
  debug "Using data.json found at $DATA_JSON_PATH"
fi

log "Checking destination directory:"
debug "Checking destination directory /usr/share/nginx/html"

if [ -d "/usr/share/nginx/html" ]; then
  log "✓ Destination directory /usr/share/nginx/html exists"
  debug "Directory exists"
  log "Contents before copy:"
  ls -la /usr/share/nginx/html/ | tee -a $LOGFILE
  debug "Directory contents:"
  ls -la /usr/share/nginx/html/ | tee -a $DEBUG_FILE
else
  log "✗ ERROR: Destination directory /usr/share/nginx/html does not exist!"
  debug "Directory does not exist"
  log "Creating destination directory"
  debug "Creating directory"
  mkdir -p /usr/share/nginx/html
  debug "Directory created, result: $?"
fi

if [ "$DATA_JSON_PATH" != "/usr/share/nginx/html/data.json" ]; then
  log "Copying data.json to web directory"
  debug "Copying from $DATA_JSON_PATH to /usr/share/nginx/html/data.json"
  cp -v "$DATA_JSON_PATH" /usr/share/nginx/html/data.json 2>&1 | tee -a $LOGFILE $DEBUG_FILE

  if [ $? -eq 0 ]; then
    log "✓ Copy operation successful"
    debug "Copy successful"
    ls -la /usr/share/nginx/html/data.json | tee -a $LOGFILE $DEBUG_FILE
  else
    log "✗ ERROR: Copy operation failed with exit code $?"
    debug "Copy failed with exit code $?"
    debug "Source file exists: $([ -f "$DATA_JSON_PATH" ] && echo "Yes" || echo "No")"
    debug "Source file is readable: $([ -r "$DATA_JSON_PATH" ] && echo "Yes" || echo "No")"
    debug "Destination is writable: $([ -w "/usr/share/nginx/html/" ] && echo "Yes" || echo "No")"
    
    log "Trying cat method instead"
    debug "Trying alternate copy method using cat"
    cat "$DATA_JSON_PATH" > /usr/share/nginx/html/data.json 2>&1 | tee -a $LOGFILE $DEBUG_FILE
    debug "Cat result: $?"
    
    if [ ! -f "/usr/share/nginx/html/data.json" ]; then
      debug "File still not created, trying echo method"
      echo "$(cat $DATA_JSON_PATH)" > /usr/share/nginx/html/data.json
      debug "Echo result: $?"
    fi
  fi
fi

log "Setting file permissions"
debug "Setting permissions on /usr/share/nginx/html/data.json"
chmod 644 /usr/share/nginx/html/data.json 2>&1 | tee -a $LOGFILE $DEBUG_FILE

if [ $? -eq 0 ]; then
  log "✓ Permission change successful"
  debug "Permission change successful"
else
  log "✗ ERROR: Permission change failed with exit code $?"
  debug "Permission change failed with exit code $?"
fi

log "Verifying the copy worked:"
debug "Verifying copy"

if [ -f "/usr/share/nginx/html/data.json" ]; then
  log "✓ Destination file /usr/share/nginx/html/data.json exists"
  debug "Destination file exists"
  log "File size: $(stat -c%s /usr/share/nginx/html/data.json) bytes"
  debug "File size: $(stat -c%s /usr/share/nginx/html/data.json) bytes"
  log "Contents of web directory after copy:"
  ls -la /usr/share/nginx/html/ | tee -a $LOGFILE
  debug "Directory contents:"
  ls -la /usr/share/nginx/html/ | tee -a $DEBUG_FILE
  log "Copied data.json contents (first 100 chars):"
  head -c 100 /usr/share/nginx/html/data.json | tee -a $LOGFILE
  debug "File content (first 500 chars):"
  head -c 500 /usr/share/nginx/html/data.json | tee -a $DEBUG_FILE
  log "..."
  
  debug "Checking if file contains placeholder markers"
  if grep -q "Test User" /usr/share/nginx/html/data.json; then
    debug "WARNING: File appears to contain placeholder data (contains 'Test User')"
  fi
else
  log "✗ ERROR: Destination file /usr/share/nginx/html/data.json does not exist after copy!"
  debug "Destination file does not exist after copy"
  debug "Last desperate attempt to create file"
  echo '{"name":"Emergency Fallback Data","contact":{"email":"emergency@fallback.com","phone":"555-555-5555","location":"Emergency Location"},"education":[{"institution":"Emergency University","degree":"Emergency Degree","graduation_date":"2025","gpa":"4.0","relevant_coursework":["Emergency Course"]}],"experience":[{"position":"Emergency Position","company":"Emergency Company","duration":"2023-Present","location":"Emergency Location","responsibilities":["Emergency responsibility"]}],"skills":{"languages":["Emergency Language"],"tools":["Emergency Tool"]},"projects":[{"name":"Emergency Project","description":"Emergency Description","technologies":["Emergency Tech"]}]}' > /usr/share/nginx/html/data.json
  debug "Emergency fallback created: $?"
fi

log "Creating debug page"
debug "Creating debug page"

cat > /usr/share/nginx/html/debug.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Container Debug Info</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    pre { background: #f4f4f4; padding: 10px; overflow: auto; max-height: 500px; }
    h2 { margin-top: 30px; color: #333; }
  </style>
</head>
<body>
  <h1>Container Debug Information</h1>
  <h2>Container Startup Log</h2>
  <pre id="log"></pre>
  <h2>Debug Log</h2>
  <pre id="debugLog"></pre>
  
  <script>
    fetch('/container-startup.log')
      .then(response => response.text())
      .then(data => {
        document.getElementById('log').textContent = data;
      })
      .catch(error => {
        document.getElementById('log').textContent = 'Error fetching log: ' + error;
      });
      
    fetch('/container-debug.log')
      .then(response => response.text())
      .then(data => {
        document.getElementById('debugLog').textContent = data;
      })
      .catch(error => {
        document.getElementById('debugLog').textContent = 'Error fetching debug log: ' + error;
      });
  </script>
</body>
</html>
EOF

log "Making log files accessible via web"
debug "Making log files accessible via web"
cp $LOGFILE /usr/share/nginx/html/container-startup.log
cp $DEBUG_FILE /usr/share/nginx/html/container-debug.log
chmod 644 /usr/share/nginx/html/container-startup.log /usr/share/nginx/html/container-debug.log

log "Starting nginx..."
debug "Starting nginx..."
exec nginx -g "daemon off;"