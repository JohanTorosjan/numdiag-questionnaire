FROM node:alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install && npm install --save-dev @types/node
COPY . .

EXPOSE 8081

CMD ["npm", "run", "dev", "--host"]