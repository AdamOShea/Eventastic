FROM node:18-slim

# Install necessary system dependencies for Chromium
RUN apt-get update && apt-get install -y \
    wget \
    python3 \
    py3-pip \
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
    chromium \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


# Set environment variables for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set Puppeteer flags for Docker compatibility
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Create and activate a Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages
RUN pip install --no-cache-dir pyairbnb==0.0.10 fast-flights

# Create app directory
WORKDIR /usr/src/app

# Copy and install Node dependencies
COPY backend/package*.json ./
RUN npm install

# Copy the app source
COPY backend/ .

# Expose the port your app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
