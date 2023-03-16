FROM node:16.17.0-alpine

WORKDIR /app

EXPOSE 4800

COPY package*.json ./

RUN npm install && npm cache clean --force

# RUN npm install && npm cache clean --force

COPY . .