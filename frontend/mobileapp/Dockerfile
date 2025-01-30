FROM node:18

# Set the working directory
WORKDIR /frontend/mobileapp

# Copy application files
# COPY . .

# Install dependencies
RUN npm install -g http-server

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["http-server", "-p", "3001"]