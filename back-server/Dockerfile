FROM node:alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install && npm install --save-dev @types/node
RUN npm install express
COPY . .
# RUN node app.js

EXPOSE 3008

CMD ["node", "app.js"]