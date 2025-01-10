FROM node:20-alpine
WORKDIR /app
COPY . .
EXPOSE 5173
CMD ["busybox", "httpd", "-f", "-v", "-p", "8080"]