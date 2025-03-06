# Use Node.js official image
FROM node:18-alpine

# ✅ Install Python & Pip in Alpine
RUN apk add --no-cache python3 py3-pip

# ✅ Set Python3 as default
RUN ln -sf python3 /usr/bin/python
RUN pip3 install --no-cache-dir pyairbnb
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
