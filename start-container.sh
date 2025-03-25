#!/bin/sh

# Copy resume data to the web directory
cp /app/data/data.json /usr/share/nginx/html/data.json

# Start nginx
nginx -g "daemon off;"