FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "src/index.js"]