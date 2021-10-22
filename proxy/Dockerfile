# Use NGINX from the Alpine Linux project
FROM nginx:alpine

# Add label for metadata
LABEL maintainer="Nisarg Patel <https://nisarg73.github.io/>"

# Remove all default nginx site-specific configurations from the container
RUN rm /etc/nginx/conf.d/*

# Copy our proxy configuration
COPY proxy.conf /etc/nginx/conf.d/
