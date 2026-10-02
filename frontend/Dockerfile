# Dockerfile untuk Frontend React + Vite (Development)
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 5173
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev"]
