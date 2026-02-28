# Small, fast Node.js runtime
FROM node:18-alpine

# Create app dir
WORKDIR /app

# Copy the single-file app
COPY app.js /app/app.js

# Install express without a package.json
RUN npm init -y \
 && npm install express \
 && npm cache clean --force

# Port (can be overridden with -e PORT=xxxx)
ENV PORT=3000
EXPOSE 3000

# Always run this program when the container starts
ENTRYPOINT ["node", "/app/app.js"]