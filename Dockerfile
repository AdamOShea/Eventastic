FROM node:18-alpine

# Install Python and Chromium dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    bash \
    udev \
    libstdc++ \
    dumb-init

# Set environment variables for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

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
CMD ["dumb-init", "npm", "start"]
