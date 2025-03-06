# Use Node.js official image
FROM node:18-alpine

# ✅ Install Python & Pip in Alpine
RUN apk add --no-cache python3 py3-pip

# ✅ Create and activate a virtual environment for Python
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# ✅ Install Python dependencies inside the virtual environment
RUN pip install --no-cache-dir pyairbnb

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
