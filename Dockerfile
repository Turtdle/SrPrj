# Dockerfile for main website
FROM node:16-alpine

# Install Python and dependencies
RUN apk add --no-cache python3 py3-pip docker
RUN pip3 install python-docx anthropic

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Create directories
RUN mkdir -p uploads container-data

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]