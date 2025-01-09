FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 7: Use a lightweight web server for serving the app
FROM nginx:alpine

# Step 8: Copy the built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Step 9: Expose the port the app will run on
EXPOSE 80

# Step 10: Start the server
CMD ["nginx", "-g", "daemon off;"]