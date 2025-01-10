FROM nginx:alpine
WORKDIR /app
COPY . /usr/share/nginx/html
COPY config/* /etc/nginx
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]