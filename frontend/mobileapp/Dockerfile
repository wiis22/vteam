FROM node:18

# Set the working directory
WORKDIR /frontend/mobileapp

# Install dependencies
RUN npm install -g http-server

COPY /frontend/mobileapp /frontend/mobileapp

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["http-server", "-p", "3001"]