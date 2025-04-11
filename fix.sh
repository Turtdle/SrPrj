#!/bin/bash
# Script to fix the professional template container issues

echo "Fixing and rebuilding professional template..."

# Ensure the start script has Unix line endings and execute permissions
echo "Fixing start-container.sh line endings..."
sed -i 's/\r$//' start-container.sh
chmod +x start-container.sh

# Create a specific start script for the professional template
echo "Creating professional template start script..."
cat > pro-start-container.sh << 'EOF'
#!/bin/sh
set -e

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

log "===== PROFESSIONAL TEMPLATE STARTUP ====="
log "Container started with the following environment:"
env | grep -v PASSWORD | grep -v KEY | sort >> $LOGFILE

log "Checking for data.json..."
for location in "/usr/share/nginx/html/data.json" "/app/data.json" "/data.json"; do
  if [ -f "$location" ]; then
    log "Found data.json at: $location"
    ls -la $location >> $LOGFILE
    head -c 100 $location >> $LOGFILE
    log "..."
    break
  fi
done

# Start nginx
log "Starting nginx..."
exec nginx -g "daemon off;"
EOF

chmod +x pro-start-container.sh

# Rebuild the professional template image
echo "Rebuilding professional-resume-viewer image..."
docker build -t professional-resume-viewer -f professional-template/Dockerfile.build --build-arg START_SCRIPT=pro-start-container.sh .

echo "Done!"