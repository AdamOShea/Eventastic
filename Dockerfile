# Use Node.js official image
FROM node:18-alpine

# Install dependencies
RUN apt update && apt install -y python3 python3-pip

# Upgrade pip and install required Python packages
RUN pip3 install --upgrade pip
RUN pip3 install pyairbnb

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally for development
RUN npm install -g nodemon

# Copy the backend code into the container
COPY backend/ .

# Expose port 3000
EXPOSE 3000

# Start the app with nodemon for hot-reloading
CMD ["npm", "start"]
