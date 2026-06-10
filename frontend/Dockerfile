FROM nginx:alpine

# Clean default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy our website files into the container
COPY . /usr/share/nginx/html/

# Overwrite Nginx configuration with our custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
