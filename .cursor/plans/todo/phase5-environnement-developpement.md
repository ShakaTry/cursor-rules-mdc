# 🐳 PHASE 5 - ENVIRONNEMENT DÉVELOPPEMENT

**Date**: 2024  
**Durée estimée**: 30min - Impact: Confort  
**Prérequis**: Phases 1-4 terminées ✅

## 🎯 **Objectifs**

- Environnement reproductible
- Facilite l'installation pour nouveaux développeurs
- Isolation des dépendances

## 📁 **Fichiers à créer (4 fichiers)**

1. **`.env.example`** - Variables d'environnement exemple
2. **`Dockerfile`** - Configuration conteneur (optionnel)
3. **`docker-compose.yml`** - Services développement (optionnel)
4. **`.dockerignore`** - Exclusions Docker

## 💡 **Pourquoi Docker ?**

- **Dockerfile**: "Recette" pour créer environnement identique partout
- **Docker-compose**: Lance plusieurs services ensemble (base de données, etc.)
- **Optionnel**: Utile mais pas obligatoire pour débuter

## 🔧 **Contenu des fichiers**

### **`.env.example`**

```bash
# Configuration exemple
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_KEY=your_api_key_here
```

### **`Dockerfile`** (exemple générique)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### **`docker-compose.yml`**

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
```

### **`.dockerignore`**

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.docker
```

## 🎯 **AVANTAGES**

- **Reproductibilité** : Même environnement partout
- **Isolation** : Pas de conflits de dépendances
- **Simplicité** : `docker-compose up` et c'est parti
- **Collaboration** : Nouveaux développeurs opérationnels rapidement

---

**STATUT** : Optionnel - À implémenter quand plus expérimenté avec Docker
