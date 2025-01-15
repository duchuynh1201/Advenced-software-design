FROM node:22.13.0-slim AS build

# Creates a directory
RUN mkdir -p /usr/src/fe-app && chown -R node:node /usr/src/fe-app

# Sets the working directory within the container
WORKDIR /usr/src/fe-app

# Copies the package.json and yarn.lock files from your local project directory into the container's working directory. 
COPY package.json yarn.lock ./

# Installs all the dependencies listed in your package.json
RUN yarn install --frozen-lockfile

# Copies all remaining files from your local project directory into the container's working directory
COPY --chown=node:node . .

# Changes the user within the container to node
# USER node

# Exposes port 4000 from the container
# EXPOSE 4000
# Lệnh build cho production
RUN yarn build 

# Defines the default command that will be executed when the container starts
# Stage production: Phục vụ file tĩnh với Nginx
FROM nginx:alpine

COPY --from=build /usr/src/fe-app/dist /usr/share/nginx/html 
# Copy file build vào thư mục của Nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]