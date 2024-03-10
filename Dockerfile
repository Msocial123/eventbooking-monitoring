# Use the official Node.js image as base
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app is running on
EXPOSE 7000

# Start the application
CMD ["node", "server.js"]