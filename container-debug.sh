#!/bin/bash
CONTAINER_ID=$1
if [ -z "$CONTAINER_ID" ]; then
    CONTAINER_ID=$(docker ps | grep resume- | head -n 1 | awk '{print $1}')
    if [ -z "$CONTAINER_ID" ]; then
        echo "No resume container found running. Please specify a container ID."
        exit 1
    fi
fi

echo "==== Container Info ===="
docker inspect $CONTAINER_ID | grep -A 5 Mounts

echo -e "\n==== Container File System ===="
docker exec $CONTAINER_ID find / -name "data.json" 2>/dev/null

echo -e "\n==== Container Data.json Content ===="
docker exec $CONTAINER_ID cat /usr/share/nginx/html/data.json 2>/dev/null || echo "File not found in expected location"

echo -e "\n==== Container Logs ===="
docker logs $CONTAINER_ID | tail -n 30