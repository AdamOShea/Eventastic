# Use Node.js official image
FROM node:18-alpine

#  Install Python & Pip in Alpine
RUN apk add --no-cache python3 py3-pip

#  Create and activate a virtual environment for Python
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

#  Install Python dependencies inside the virtual environment
RUN pip install --no-cache-dir pyairbnb==0.0.10
RUN pip install --no-cache-dir fast-flights

# Install dependencies for Chromium
RUN apk update && apk install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    --no-install-recommends && \
    apk clean && rm -rf /var/lib/apt/lists/*

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
