FROM node:alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3008

# Utiliser start au lieu de dev pour la production
CMD ["npm", "start"]
