FROM node:alpine

WORKDIR /app
COPY package*.json ./
RUN npm install && npm install --save-dev @types/node
COPY . .
# RUN node app.js

EXPOSE 3008

CMD ["npm", "run", "dev"]