FROM nginx:alpine
WORKDIR /app
COPY dist/* /usr/share/nginx/html
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]