FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier tout le code source
COPY . .

# Build l'application
RUN npm run build

# Vérifier que dist existe
RUN ls -la /app/dist || echo "ERROR: dist folder not found!"

# Installer serve globalement
RUN npm install -g serve@14.2.1

EXPOSE 8081

# Servir depuis dist
CMD ["serve", "-s", "dist", "-l", "8081"]
