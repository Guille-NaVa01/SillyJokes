# Dockerfile for the Node.js backend
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production deps only
COPY package.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
