# Base image
FROM node:22.12.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn

# Copy application source
COPY . .

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["yarn", "dev"]
