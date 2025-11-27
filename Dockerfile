# ---------- FRONTEND BUILD ----------
    FROM node:18 AS frontend
    
    WORKDIR /app/reactfrontend
    
    COPY reactfrontend/package*.json ./
    RUN npm install
    
    COPY reactfrontend .
    RUN npm run build
    
    
    # ---------- BACKEND BUILD ----------
    FROM node:18 AS backend
    
    WORKDIR /app/expressbackend
    
    COPY expressbackend/package*.json ./
    RUN npm install
    
    COPY expressbackend .
    
    # Bring frontend build into backend
    COPY --from=frontend /app/reactfrontend/build ../reactfrontend/build
    
    EXPOSE 5000
    
    CMD ["node", "server.js"]
    