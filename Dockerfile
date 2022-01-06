# Get the base image
FROM node:17-alpine3.14

# Set the working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json first, then install dependencies, then copy everything else
COPY ./package.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY ./ ./

EXPOSE 3000

CMD ["npm", "start"]