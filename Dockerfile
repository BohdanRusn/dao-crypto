# Use the official Node.js image from the Docker Hub
FROM node:18.16.1-alpine

# Set a label for the image
LABEL authors="Bagdan"

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]
