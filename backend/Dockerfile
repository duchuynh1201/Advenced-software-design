FROM node:16.19.0-slim

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
# RUN apt-get update && apt-get install gnupg wget -y && \
#   wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
#   sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
#   apt-get update && \
#   apt-get install google-chrome-stable -y --no-install-recommends && \
#   rm -rf /var/lib/apt/lists/*
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Creates a directory
RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

# Sets the working directory within the container
WORKDIR /usr/src/node-app

# Copies the package.json and yarn.lock files from your local project directory into the container's working directory. 
COPY package.json yarn.lock ./

# Changes the user within the container to node
USER node

# Installs all the dependencies listed in your package.json
RUN yarn install --pure-lockfile 

# Copies all remaining files from your local project directory into the container's working directory
COPY --chown=node:node . .

# Run the prisma:generate command from your yarn.lock dependencies
RUN yarn prisma:generate

# Exposes port 3000 from the container
EXPOSE 3000

# Defines the default command that will be executed when the container starts
CMD ["yarn", "start"]
