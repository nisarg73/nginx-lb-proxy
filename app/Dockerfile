# Use Node from the Alpine Linux project 
FROM node:12.18.3-alpine

# Add label for metadata
LABEL maintainer="Nisarg Patel <https://nisarg73.github.io/>"

# Create app directory
WORKDIR /usr/src/nginx-lb-proxy

# Install all the dependancies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Port to which container will listen
EXPOSE 3110

# Run server
CMD [ "node", "server.js" ]
