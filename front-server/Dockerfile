FROM node:alpine

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm install && npm install --save-dev @types/node

# Copier le reste (y compris les .env)
COPY . .

EXPOSE 8081

# Utiliser --host pour que Vite soit accessible depuis l'extérieur du container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]