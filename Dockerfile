FROM node:16-alpine

RUN apk add --no-cache python3 py3-pip docker
RUN pip3 install python-docx anthropic==0.49.0 httpx==0.27.2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p uploads container-data

EXPOSE 3000

CMD ["node", "server.js"]