FROM httpd:2.4
WORKDIR /app
COPY . .
EXPOSE 5173
CMD ["httpd", "-f", "-v"]