# 1. Update Docker security settings if needed
sudo usermod -aG docker $USER

# 2. Create the environment file for your EC2 instance
cat > .env << EOL
# Set your EC2 public IP here
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
EOL

# 3. Update docker-compose.yml to expose all necessary ports
cat > docker-compose.yml << EOL
version: '3'

services:
  main-website:
    build: .
    ports:
      - "3000:3000"
      - "8000-9000:8000-9000"  # Range for dynamically assigned container ports
    volumes:
      - ./:/app
      - /app/node_modules
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - NODE_ENV=production
      - EC2_PUBLIC_IP=${EC2_PUBLIC_IP}
    restart: unless-stopped
    container_name: resume-generator-main
    extra_hosts:
      - "host.docker.internal:host-gateway"

  professional-resume-builder:
    build:
      context: .
      dockerfile: professional-template/Dockerfile.build
    image: professional-resume-viewer
    container_name: professional-resume-builder
EOL

# 4. Update the run-container code in server.js
# (You'll need to apply this manually to your server.js file)
cat > container-run-commands.txt << EOL
// Replace this line in server.js:
const runContainerCmd = `docker run -d -p ${containerPort}:80 --name ${uniqueContainerName} ${imageTag}`;

// With this:
const runContainerCmd = `docker run -d -p ${containerPort}:80 --name ${uniqueContainerName} --add-host=host.docker.internal:host-gateway -e SERVER_HOST=${serverConfig.publicIP} ${imageTag}`;
EOL

# 5. Update iptables to allow the container ports
sudo iptables -A INPUT -p tcp --dport 8000:9000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

# To make the changes permanent, install iptables-persistent
sudo apt-get update && sudo apt-get install -y iptables-persistent
sudo netfilter-persistent save

# 6. If you're using AWS Security Groups, you'll need to update them too:
echo "Don't forget to update your EC2 Security Groups to allow ports 8000-9000"
echo "You can do this from the AWS Management Console under EC2 > Security Groups"