# Use NGINX from the Alpine Linux project 
FROM nginx:alpine

# Remove all default nginx site-specific configurations from the container
RUN rm /etc/nginx/conf.d/*

# Copy our proxy configuration
COPY proxy.conf /etc/nginx/conf.d/
