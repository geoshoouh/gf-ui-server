FROM httpd:2.4
WORKDIR /app
COPY . .
EXPOSE 5173
CMD ["busybox", "httpd", "-f", "-v", "-p", "8080"]