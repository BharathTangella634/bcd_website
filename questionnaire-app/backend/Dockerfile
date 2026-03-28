# # Dockerfile for Express backend
# FROM node:20-alpine

# # Set backend working directory (will be created if it doesn't exist)
# WORKDIR /app/questionnaire-app/backend

# # Copy only package manifests first to leverage Docker layer cache
# COPY questionnaire-app/backend/package*.json ./
# # Install production dependencies without requiring a lockfile (avoids root lockfile conflicts)
# RUN npm install --omit=dev --no-audit --no-fund

# # Copy the entire questionnaire-app so backend can import ../mysql_explorer/db.js
# COPY questionnaire-app /app/questionnaire-app

# EXPOSE 3001
# CMD ["npm", "start"]


# Backend Dockerfile





FROM node:20-alpine

WORKDIR /app

# Copy only backend package files first for caching
COPY backend/package*.json ./

RUN npm install --omit=dev --no-audit --no-fund

# ✅ Copy backend, mysql_explorer, and any shared folders
COPY backend ./backend
COPY mysql_explorer ./mysql_explorer
COPY public ./public
COPY *.pem ./

# ✅ Expose backend port
EXPOSE 3001

# ✅ Start backend with correct path
CMD ["node", "backend/server.js"]





# # # Backend Dockerfile
# # Backend Dockerfile
# FROM node:20-alpine

# WORKDIR /app

# # Copy only backend package files first for caching
# COPY backend/package*.json ./backend/

# # Set WORKDIR for npm install
# WORKDIR /app/backend
# RUN npm install --omit=dev --no-audit --no-fund

# # Go back to the app root for copying all source files
# WORKDIR /app
# COPY backend ./backend
# COPY mysql_explorer ./mysql_explorer

# # --- ADD THIS LINE ---
# # This copies the JSON file from your project's src/assets folder
# # INTO the /app/backend/ folder inside the container, where server.js
# # is now looking for it.
# # --- END ADDITION ---

# # Expose backend port
# EXPOSE 3001

# # ✅ Start backend with correct path
# CMD ["node", "backend/server.js"]