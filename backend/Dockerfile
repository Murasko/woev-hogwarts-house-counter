# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies, ensuring native dependencies are built correctly
RUN npm install --production --unsafe-perm

# If the above doesn't work, you can force a rebuild of sqlite3 specifically
# This ensures that sqlite3 is compiled for the Docker environment
RUN npm rebuild sqlite3 --build-from-source

# Bundle app source inside Docker image
COPY . .

# Your app binds to port 3001
EXPOSE 3001

# Command to run the app
CMD ["node", "server.js"]