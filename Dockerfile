# Use an official Node runtime as a parent image
FROM node:20.9.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Your app binds to port 3001 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3001

# Define the command to run your app
CMD ["npm", "start"]
